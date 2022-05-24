const { expect } = require("chai");
const { ethers } = require("hardhat");
const Wallet = require('ethereumjs-wallet').default;
const { fromRpcSig } = require('ethereumjs-util');
const ethSigUtil = require('eth-sig-util');
const web3 = require('web3');

  const name = 'Venimir NFT';
  const symbol = 'VLP';
  const firstTokenId = "0";
  const baseURI = 'https://api.vlp.com/v1/';
  let owner, addr1, addr2;
  let chainId;
  let venimirNftContract;
  const version = web3.utils.toBN('1');

  const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ];
  const Permit = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ];
  const duration = {
    seconds: function (val) { return new BN(val); },
    minutes: function (val) { return new BN(val).mul(this.seconds('60')); },
    hours: function (val) { return new BN(val).mul(this.minutes('60')); },
    days: function (val) { return new BN(val).mul(this.hours('24')); },
    weeks: function (val) { return new BN(val).mul(this.days('7')); },
    years: function (val) { return new BN(val).mul(this.days('365')); },
  };

  // Returns the time of the last mined block in seconds
  async function latest () {
    const block = await web3.eth.getBlock('latest');
    return block.timestamp;
  }
  beforeEach(async function () {
    const ERC721Factory = await ethers.getContractFactory("ERC721");
    const ERC721 = await ERC721Factory.deploy(name, symbol);
    venimirNftContract = await ERC721.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
    chainId = venimirNftContract.provider._network.chainId;
  });

  describe("ERC721", function () {

    it("should mint and transfer batch of 100 NFTs", async function () {
      for(let i = 0; i < 10; i++){
        const mintTx = await venimirNftContract.safeMint(owner.address, i);
        const mintReceipt = await mintTx.wait();
      }
      for(let i = 0; i < 10; i++){
        const transferTx = await venimirNftContract.transferFrom(owner.address, addr1.address, i);
        const transferReceipt = await transferTx.wait();
      }
    });

    it("should mint batch", async function () {
        let mintTen = []
        for(let i = 0; i < 10; i++){
          mintTen.push({
              to: owner.address,
              tokenId: i,
              data: '0x00'
          })
        }

        // const tenbatchMintTx = await venimirNftContract.batchMint(mintTen);
        // const tenbatchMintReceipt = await tenbatchMintTx.wait();
        // console.log(tenbatchMintReceipt.gasUsed.toString());
        // let uGas = Number(tenbatchMintReceipt.gasUsed.toString())
        // console.log('10 nft mintin average gas for each: ', uGas/10)

        let mintHundred = []
        for(let i = 10; i < 110; i++){
          mintHundred.push({
              to: owner.address,
              tokenId: i,
              data: '0x00'
          })
        }
        
        // const mintHundredbatchMintTx = await venimirNftContract.batchMint(mintHundred);
        // const mintHundredbatchMintReceipt = await mintHundredbatchMintTx.wait();
        // console.log(mintHundredbatchMintReceipt.gasUsed.toString());
        // uGas = Number(mintHundredbatchMintReceipt.gasUsed.toString())
        // console.log('100 nft mintin average gas for each: ', uGas/100)
    });

    it("should mint batch and transfer batch", async function () {
      let mintTen = []
      for(let i = 0; i < 10; i++){
        mintTen.push({
            to: owner.address,
            tokenId: i,
            data: '0x00'
        })
      }
      
      // const tenbatchMintTx = await venimirNftContract.batchMint(mintTen);
      // const tenbatchMintReceipt = await tenbatchMintTx.wait();
      // console.log(tenbatchMintReceipt.gasUsed.toString());
      // let uGas = Number(tenbatchMintReceipt.gasUsed.toString())
      // console.log('10 nft mintin average gas for each: ', uGas/10)

      for(let i = 0; i < mintTen; i++){
        mintTen[i].to = addr1.address;
      }
      
      // const tenTransferMintTx = await venimirNftContract.batchTransfer(mintTen);
      // const tenTransferMintReceipt = await tenTransferMintTx.wait();
      // uGas = Number(tenTransferMintReceipt.gasUsed.toString())
      // console.log('10 nft transfer average gas for each: ', uGas/10)
    });
  });
