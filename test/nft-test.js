const { ethers } = require("hardhat");


  const name = 'Venimir NFT';
  const symbol = 'VLP';
  let owner, addr1, addr2;
  let chainId;
  let venimirNftContract;

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
