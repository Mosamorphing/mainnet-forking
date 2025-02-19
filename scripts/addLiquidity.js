const { ethers } = require("hardhat");
const { Token, WETH9, NonfungiblePositionManager } = require("@uniswap/v3-core");
const { NonfungiblePositionManagerAddress } = require("@uniswap/v3-periphery");

async function main() {

    const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const positionManager = new ethers.Contract(
    NonfungiblePositionManagerAddress,
    NonfungiblePositionManager.abi,
    signer
  );

  const fee = 3000;

  const tickLower = -887220; // Lower tick for the price range
  const tickUpper = 887220; // Upper tick for the price range

  // Define liquidity amount (e.g., 1 WETH and 2000 USDC)
  const amount0Desired = ethers.utils.parseUnits("2000", 6); // USDC has 6 decimals
  const amount1Desired = ethers.utils.parseEther("1"); // WETH has 18 decimals

  // Approve tokens for the NonfungiblePositionManager
  const usdcContract = new ethers.Contract(USDC, Token.abi, signer);
  const wethContract = new ethers.Contract(WETH, WETH9.abi, signer);

  await usdcContract.approve(positionManager.address, amount0Desired);
  await wethContract.approve(positionManager.address, amount1Desired);
  console.log("Tokens approved");

  // Add liquidity to the pool
  const tx = await positionManager.mint({
    token0: USDC,
    token1: WETH,
    fee: fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: amount0Desired,
    amount1Desired: amount1Desired,
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
  });

  console.log("Transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Liquidity added successfully:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});