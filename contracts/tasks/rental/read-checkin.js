const { types } = require("hardhat/config")
const { networks } = require("../../networks")

task("read-checkin", "read if the checkin was fulfilled of a given orderId")
    .addParam("contract", "Address of the consumer contract (checkin contract) to read")
  .addParam("orderId", "orderId to check status")
  .setAction(async (taskArgs) => {
    const { contract, orderId } = taskArgs;

    console.log(`checking state of checkin in  ${network.name}`)
    console.log("\n__Compiling Contracts__")
    await run("compile")

    const overrides = {}
    // If specified, use the gas price from the network config instead of Ethers estimated price
    if (networks[network.name].gasPrice) {
      overrides.gasPrice = networks[network.name].gasPrice
    }
    // If specified, use the nonce from the network config instead of automatically calculating it
    if (networks[network.name].nonce) {
      overrides.nonce = networks[network.name].nonce
    }


    const checkinFactory = await ethers.getContractFactory("SimpleRentCheckin");
    const checkinContract = checkinFactory.attach(contract); 
    const checkinDetails = await checkinContract.checkins(orderId);

    console.log(`Checkin details for orderId ${orderId}:`);
    console.log(`NFT Address: ${checkinDetails.nftAddress}`);
    console.log(`Token ID: ${checkinDetails.tokenId}`);
    console.log(`Status: ${checkinDetails.status}`);
    console.log(`Renter Address: ${checkinDetails.renterAddress}`);
  })
