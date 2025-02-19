require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_MAINNET_RPC}`,
        blockNumber: 16850000, // Use a recent block number
      },
    },
  },
};