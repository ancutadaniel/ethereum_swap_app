const EthSwap = artifacts.require('EthSwap');
const Token = artifacts.require('Token');

module.exports = async (deployer) => {
  //deploy contracts
  await deployer.deploy(Token);
  const token = await Token.deployed();
  //pass the params for constructor
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed();

  // transfer the tokens created in Token and assign to ethSwap contract
  await token.transfer(ethSwap.address, '1000000000000000000000000');
};
