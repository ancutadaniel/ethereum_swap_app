const Token = artifacts.require('Token');
const { assert } = require('chai');
const chai = require('chai');

chai.use(require('chai-as-promised')).should();

contract('Token', function (accounts) {
  let token;

  before('check deploy', async () => {
    token = await Token.deployed();
  });

  describe('contract is deployed', async () => {
    it('should have an address', async () => {
      const address = await Token.address;
      console.log(address);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });

    it('should assert true', async function () {
      await Token.deployed();
      return assert.isTrue(true);
    });

    it('should have a name', async () => {
      const name = await token.name();
      const symbol = await token.symbol();
      assert.equal(name, `Dacether`);
      assert.equal(symbol, `DCT`);
      assert.isNotEmpty(name);
      assert.isNotEmpty(symbol);
    });
  });
});
