const EthSwap = artifacts.require('EthSwap');
const Token = artifacts.require('Token');
const { assert } = require('chai');
const chai = require('chai');

chai.use(require('chai-as-promised')).should();

const tokens = (n) => {
  return web3.utils.toWei(n, 'ether');
};

contract('EthSwap', async ([deployer, investor]) => {
  let ethSwap, token, balance;

  before('check deploy', async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    await token.transfer(ethSwap.address, tokens('1000000'));
    balance = await token.balanceOf(ethSwap.address);
  });

  describe('contract is deployed', async () => {
    it('should have an address', async () => {
      const address = await ethSwap.address;
      console.log(address);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });

    it('should assert true', async function () {
      await EthSwap.deployed();
      return assert.isTrue(true);
    });

    it('should have a name', async () => {
      const name = await ethSwap.name();
      assert.equal(name, `EthSwap Instant Exchange`);
      assert.isNotEmpty(name);
    });
  });

  describe('contract ethSwap has tokens', async () => {
    it('should have tokens', async () => {
      // transfer the tokens created in Token and assign to ethSwap contract
      assert.equal(balance.toString(), tokens('1000000'));
    });
  });

  describe('can buy tokens', async () => {
    let result, ethSwapBalance, event;
    before(async () => {
      result = await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei('1', 'ether'),
      });
      ethSwapBalance = await token.balanceOf(ethSwap.address);
    });

    it('should have 100 DCT tokens for 1 ether', async () => {
      const balanceDCT = await token.balanceOf(investor);
      assert.equal(balanceDCT.toString(), tokens('100'));
    });

    it('should have decrease tokens by 100', async () => {
      assert.equal(ethSwapBalance.toString(), tokens('999900'));
    });

    it('should increase the ether balance by 1 ether', async () => {
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'));
    });

    it('should have an event emitted', async () => {
      // get the event
      event = await result.logs[0].args;

      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('100').toString());
      assert.equal(event.rate.toString(), '100');
    });

    it('should fail if is send 0 ether', async () => {
      // Fail
      await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei('0', 'ether'),
      }).should.be.rejected;
    });

    it('should fail if EthSwap has not enough tokens', async () => {
      await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei('10000', 'ether'),
      }).should.be.rejected;
    });
  });

  describe('can sell tokens', async () => {
    let result, ethSwapBalance, event;
    before(async () => {
      // investor must approve the tokens before purchase
      await token.approve(ethSwap.address, tokens('100'), { from: investor });
      // sell tokens
      result = await ethSwap.sellTokens(tokens('100'), {
        from: investor,
      });
      ethSwapBalance = await token.balanceOf(ethSwap.address);
    });

    it('investor balance', async () => {
      const investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('0'));
    });

    it('should have increase by 100 DCT', async () => {
      assert.equal(ethSwapBalance.toString(), tokens('1000000'));
    });

    it('should decrease the ether balance by 1 ether', async () => {
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'));
    });

    it('should have an event emitted', async () => {
      // get the event
      event = await result.logs[0].args;

      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('100').toString());
      assert.equal(event.rate.toString(), '100');
    });

    it('should fail if is send more tokens that is available', async () => {
      // Fail
      await ethSwap.sellTokens(tokens('500'), {
        from: investor,
      }).should.be.rejected;
    });
  });
});
