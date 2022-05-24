// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const erc20 = await ERC20.deploy("Venimir Petkov", "VP");
  await erc20.deployed();
  console.log("ERC20 deployed to:", erc20.address);

  const ERC20PermitWraper = await hre.ethers.getContractFactory("ERC20PermitWraper");
  const erc20PermitWraper = await ERC20PermitWraper.deploy(erc20.address);
  await erc20PermitWraper.deployed();
  console.log("ERC20PermitWraper deployed to:", erc20PermitWraper.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
