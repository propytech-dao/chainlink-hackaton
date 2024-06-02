const { types } = require("hardhat/config")
const { networks } = require("../../networks")

task("deploy-renter", "Deploys the SimpleRent contract")
  .setAction(async (taskArgs) => {
    console.log(`Deploying SimpleRent contract to  ${network.name}`)
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

    const consumerContractFactory = await ethers.getContractFactory("SimpleRent")
    const consumerContract = await consumerContractFactory.deploy()

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        consumerContract.deployTransaction.hash
      } to be confirmed...`
    )
    await consumerContract.deployTransaction.wait(networks[network.name].confirmations)



    const verifyContract = taskArgs.verify
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log("\nVerifying contract...")
        await run("verify:verify", {
          address: consumerContract.address,
          constructorArguments: [],
        })
        console.log("Contract verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log(
            "Error verifying contract.  Ensure you are waiting for enough confirmation blocks, delete the build folder and try again."
          )
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log("\nScanner API key is missing. Skipping contract verification...")
    }
    
    console.log(`\n deployed SimpleRent ${consumerContract.address} on ${network.name}`)


  })
