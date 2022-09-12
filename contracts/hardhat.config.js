require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: '.env'});

const { ALCHEMY_API_KEY_URL, GOERLI_PRIVATE_KEY } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [GOERLI_PRIVATE_KEY],
    }
  }
};
