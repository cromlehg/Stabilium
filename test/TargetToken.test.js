const { BN, expectEvent, expectRevert } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const CommonToken = artifacts.require('CommonToken');
const TargetToken = artifacts.require('TargetToken');

contract('TargetToken', function () {
  const _operator = '0xEA15Adb66DC92a4BbCcC8Bf32fd25E2e86a2A770';
  const _name = 'Stabilium';
  const _symbol = 'STB';
  const _amount = new BN(5000000000);
  const _decimals = new BN(18);

  beforeEach(async function () {
    this.targetToken = await TargetToken.new();
  });

  it('has a name', async function () {
    expect(await this.targetToken.name()).to.equal(_name);
  });

  it('has a symbol', async function () {
    expect(await this.targetToken.symbol()).to.equal(_symbol);
  });

  it('has an amount of decimals', async function () {
    expect(await this.targetToken.decimals()).to.be.bignumber.equal(_decimals);
  });

  it('has an owner as described in constructor', async function () {
    expect(await this.targetToken.owner()).to.equal(_operator);
  });

  it('has total supply as described in constructor', async function () {
    expect(await this.targetToken.totalSupply()).to.be.bignumber.equal(_amount.mul((new BN(10)).pow(_decimals)));
  });
});

contract('CommonToken', function ([_, initialHolder, account1, account2]) {
  beforeEach(async function () {
    this.commonToken = await CommonToken.new(initialHolder, 'CommonToken', 'CMN', new BN(5000000000));
  });

  describe('transfer', function () {
    const amount = new BN(1);
    beforeEach(async function () {
      await this.commonToken.transfer(account1, amount, { from: initialHolder });
    });
    describe('if lock period has not finished', function () {
      describe('sender is not initial holder', function () {
        it('reverts', async function () {
          await expectRevert(this.commonToken.transfer(account2, new BN, { from: account1 }), 'You are not allowed to move tokens');
        });
      });
      describe('sender is initial holder', function () {
        it('emits a transfer event', async function () {
          const { logs } = await this.commonToken.transfer(account1, amount, {from: initialHolder});
          expectEvent.inLogs(logs, 'Transfer', {from: initialHolder, to: account1, value: amount});
        });
      });
      // describe('sender is in lockFilter', function () {
      //   before(async function () {
      //     await this.commonToken.finishLockPeriod({ from: initialHolder});
      //   });
      //   it('emits a transfer event', async function () {
      //     const { logs } = await this.commonToken.transfer(account1, amount, {from: initialHolder});
      //     expectEvent.inLogs(logs, 'Transfer', {from: initialHolder, to: account1, value: amount});
      //   });
      // });
    });
    describe('if lock period has finished', function () {
      beforeEach(async function () {
        await this.commonToken.finishLockPeriod({ from: initialHolder});
      });
      it('emits a transfer event', async function () {
        const { logs } = await this.commonToken.transfer(account2, amount, {from: account1});
        expectEvent.inLogs(logs, 'Transfer', {from: account1, to: account2, value: amount});
      });
    });
  });
});
