const { BN } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const TargetToken = artifacts.require('TargetToken');

contract('ERC20Detailed', function () {
  const _operator = '0xEA15Adb66DC92a4BbCcC8Bf32fd25E2e86a2A770';
  const _name = 'Stabilium';
  const _symbol = 'STB';
  const _decimals = new BN(18);

  beforeEach(async function () {
    this.detailedERC20 = await TargetToken.new();
  });

  it('has a name', async function () {
    expect(await this.detailedERC20.name()).to.equal(_name);
  });

  it('has a symbol', async function () {
    expect(await this.detailedERC20.symbol()).to.equal(_symbol);
  });

  it('has an amount of decimals', async function () {
    expect(await this.detailedERC20.decimals()).to.be.bignumber.equal(_decimals);
  });
});
