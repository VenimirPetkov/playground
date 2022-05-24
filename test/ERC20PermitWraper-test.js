
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


let VenimirERC20Instance;
let VenimirERC20WraperInstance;
let owner, addr1, addr2;

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

beforeEach(async function () {
  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const erc20 = await ERC20.deploy("Venimir Petkov", "VP");
  VenimirERC20Instance = await erc20.deployed();

  const ERC20PermitWraper = await hre.ethers.getContractFactory("ERC20PermitWraper");
  const erc20PermitWraper = await ERC20PermitWraper.deploy(erc20.address);
  VenimirERC20WraperInstance = await erc20PermitWraper.deployed();

  [owner, addr1, addr2] = await ethers.getSigners();
});

describe("ERC20", function () {
  it("should approve to wraper max", async function () {
    //Given
      let tx;
      let allowance;
    //When
      tx = await VenimirERC20Instance.approve(VenimirERC20WraperInstance.address, MAX_UINT256);
      const recipe = await tx.wait();
      allowance = await VenimirERC20Instance.allowance(owner.address, VenimirERC20WraperInstance.address)
    //Then
      assert.equal(recipe.status, 1, "unsuccessful approval");
      assert.equal(allowance.toString(), MAX_UINT256, "wrong allowance amount");
  });
});

describe("ERC20PermitWraper", function () {
  it("should approve to wraper max and wraper transfer", async function () {
    //Given
      const tokenAmount = 10;
      const deadline = MAX_UINT256;

      let allowance;
      let ownerNonceBefore, ownerNonceAfter;

      let approveTx, transferWithSigTx;
      
      let transferWithSigTxRecipie;

      let ownerBalanceBefore, 
      ownerBalanceAfter, 
      addr1BalanceBefore, 
      addr1BalanceAfter;
    //When
      ownerBalanceBefore = await VenimirERC20Instance.balanceOf(owner.address);
      addr1BalanceBefore = await VenimirERC20Instance.balanceOf(addr1.address);

      approveTx = await VenimirERC20Instance.approve(VenimirERC20WraperInstance.address, MAX_UINT256);
      await approveTx.wait();
      allowance = await VenimirERC20Instance.allowance(owner.address, VenimirERC20WraperInstance.address)

      ownerNonceBefore = await VenimirERC20WraperInstance.getNonce();

      const payloadFromContract = await VenimirERC20WraperInstance.getPayload(owner.address, addr1.address, tokenAmount, deadline);
      const payloadHash = web3.utils.soliditySha3(payloadFromContract);
      const signature = await web3.eth.sign(payloadHash, owner.address);

      transferWithSigTx = await VenimirERC20WraperInstance.transferWithPermit(signature, owner.address, addr1.address, tokenAmount, deadline);
      transferWithSigTxRecipie = await transferWithSigTx.wait();

      ownerNonceAfter = await VenimirERC20WraperInstance.getNonce();
      ownerBalanceAfter = await VenimirERC20Instance.balanceOf(owner.address);
      addr1BalanceAfter = await VenimirERC20Instance.balanceOf(addr1.address);
    //Then
      assert.equal(allowance.toString(), MAX_UINT256, "wrong allowance amount");
      assert.equal(ownerBalanceAfter.toString(), (ownerBalanceBefore - tokenAmount).toString(), "wrong balance amount");
      assert.equal(ownerNonceAfter.toString(), (Number(ownerNonceBefore) + 1).toString(), "wrong nonce");
  });

  it("should not use same signature twice", async function () {
    //Given
      const tokenAmount = 10;
      const deadline = MAX_UINT256;

      let txError;
      let expectedError = 'ERC20Permit: Failed to verify signature';
      let allowance;
      let ownerNonceBefore, ownerNonceAfter;

      let approveTx, transferWithSigTx;
      
      let transferWithSigTxRecipie;

      let ownerBalanceBefore, 
      ownerBalanceAfter, 
      addr1BalanceBefore, 
      addr1BalanceAfter;
    //When
      ownerBalanceBefore = await VenimirERC20Instance.balanceOf(owner.address);
      addr1BalanceBefore = await VenimirERC20Instance.balanceOf(addr1.address);

      approveTx = await VenimirERC20Instance.approve(VenimirERC20WraperInstance.address, MAX_UINT256);
      await approveTx.wait();
      allowance = await VenimirERC20Instance.allowance(owner.address, VenimirERC20WraperInstance.address)

      ownerNonceBefore = await VenimirERC20WraperInstance.getNonce();

      const payloadFromContract = await VenimirERC20WraperInstance.getPayload(owner.address, addr1.address, tokenAmount, deadline);
      const payloadHash = web3.utils.soliditySha3(payloadFromContract);
      const signature = await web3.eth.sign(payloadHash, owner.address);

      transferWithSigTx = await VenimirERC20WraperInstance.transferWithPermit(signature, owner.address, addr1.address, tokenAmount, deadline);
      transferWithSigTxRecipie = await transferWithSigTx.wait();

      try {
        transferWithSigTx = await VenimirERC20WraperInstance.transferWithPermit(signature, owner.address, addr1.address, tokenAmount, deadline);
        transferWithSigTxRecipie = await transferWithSigTx.wait();
      } catch (error) {
        txError = error
      }

      ownerNonceAfter = await VenimirERC20WraperInstance.getNonce();
      ownerBalanceAfter = await VenimirERC20Instance.balanceOf(owner.address);
      addr1BalanceAfter = await VenimirERC20Instance.balanceOf(addr1.address);
      
    //Then
      assert.equal(allowance.toString(), MAX_UINT256, "wrong allowance amount");
      assert.equal(ownerBalanceAfter.toString(), (ownerBalanceBefore - tokenAmount).toString(), "wrong balance amount");
      assert.include(txError.toString(), expectedError, "wrong error");
  });
});