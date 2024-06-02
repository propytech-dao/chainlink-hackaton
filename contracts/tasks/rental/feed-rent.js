const { types } = require("hardhat/config")
const { networks } = require("../../networks")
const { assert, expect } = require("chai")



task("feed-rent", "replicate the integration tests to feed a SimpleRent contract with a lot of data")
    .addParam("contract", "Address of the simpleRent contract")
  .setAction(async (taskArgs) => {

    console.log(`feeding data to SimpleRent contract in  ${network.name}`)
    console.log("\n__Compiling Contracts__")
    await run("compile")

    let MockNFT, mockNFT
    let MockUSDT, mockUSDT
    let SimpleRent, simpleRent
    let owner, renter
    let lastOrderId



  
      [owner] = await ethers.getSigners()
  
      // Create a new wallet for the renter
      let renterWallet = ethers.Wallet.createRandom()
  
      // Connect the renter wallet to the provider
      renter = renterWallet.connect(ethers.provider)
  
      const addressToCheck = owner.address
      const balance = await ethers.provider.getBalance(addressToCheck)
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log(`Balance of address ${addressToCheck}: ${balanceInEth} ETH`)
      expect(balance.gt(0)).to.be.true
  
      // Get the contract factory
      MockNFT = await ethers.getContractFactory("MockNFT")
  
      // Deploy the contract
      mockNFT = await MockNFT.deploy(owner.address)
      await mockNFT.deployed()
  
      console.log("MockNFT deployed to:", mockNFT.address)
  
      // Verify the contract's deployment
      const name = await mockNFT.name()
      const symbol = await mockNFT.symbol()
      expect(name).to.equal("MockNFT")
      expect(symbol).to.equal("MTK")
  
      // Mint a token to the owner's address

      const tx = await mockNFT.safeMint(owner.address, "mockUri")
      await tx.wait()
  
      // Verify the token was minted
      const ownerOfToken = await mockNFT.ownerOf(0)
      expect(ownerOfToken).to.equal(owner.address)
  


      // Get the contract factory and deploy the mock USDT contract
      MockUSDT = await ethers.getContractFactory("MockUSDT")
      mockUSDT = await MockUSDT.deploy(ethers.utils.parseUnits("1000000", 6)) // 1 million USDT with 6 decimals
      await mockUSDT.deployed()
  
      SimpleRent = await ethers.getContractFactory("SimpleRent")
      simpleRent = await SimpleRent.attach(taskArgs.contract)
      let orderId = await simpleRent.lastOrder();
      console.log("last orderId:", orderId)
      lastOrderId = orderId;
      
      let tokenID = 0
       nftAddress = mockNFT.address
       rentValue = ethers.utils.parseUnits("10", 6) // 10 units with 6 decimals
      await mockNFT.connect(owner).approve(simpleRent.address, tokenID)
      await expect(await simpleRent.connect(owner).lend(nftAddress, tokenID, rentValue, mockUSDT.address))
        .to.emit(simpleRent, "Lent")
        .withArgs(lastOrderId.add(1), nftAddress, tokenID, owner.address, rentValue, mockUSDT.address)
  
      // Check the NFT ownership is transferred to the SimpleRent contract
      expect(await mockNFT.ownerOf(tokenID)).to.equal(simpleRent.address)
    rentingDetails = await simpleRent.getRentalDetails(lastOrderId.add(1))
      console.log({ rentingDetails })
  
      // Fund the renter wallet with some ETH from the owner
      await owner.sendTransaction({
        to: renter.address,
        value: ethers.utils.parseEther("1.0"), // Send 1 ETH
      })
      // Fund the renter with some MockUSDT
      await mockUSDT.transfer(renter.address, ethers.utils.parseUnits("1000", 6))
  
      // renter approves ERC20 token for the SimpleRent to use
      await mockUSDT.connect(renter).approve(simpleRent.address, ethers.utils.parseUnits("1000", 6))
  
      // Verify renter balances and approvals
      const renterEthBalance = await ethers.provider.getBalance(renter.address)
      const renterUsdtBalance = await mockUSDT.balanceOf(renter.address)
      const renterAllowance = await mockUSDT.allowance(renter.address, simpleRent.address)
  
      expect(renterEthBalance).to.be.above(ethers.utils.parseEther("0.9")) // Accounting for gas fees
      expect(renterUsdtBalance).to.equal(ethers.utils.parseUnits("1000", 6))
      expect(renterAllowance).to.equal(ethers.utils.parseUnits("1000", 6))
  
      // check if the renter is able to send small values
      await mockUSDT.connect(renter).transfer(owner.address, ethers.utils.parseUnits("5", 6))
        
        nftAddress = mockNFT.address
        tokenID = 0
        const rentDuration = 1 // in days
         rentValue = ethers.utils.parseUnits("10", 6) // 10 units with 6 decimal
         totalRentAmount = rentValue.mul(rentDuration)
  
        // Rent the NFT
        await expect(await simpleRent.connect(renter).rent(lastOrderId.add(1), rentDuration))
          .to.emit(simpleRent, "Rented")
          .withArgs(lastOrderId.add(1), nftAddress, tokenID, renter.address, totalRentAmount, rentDuration)
  
        // Verify that the renting details are correct
         rentingDetails = await simpleRent.getRentalDetails(lastOrderId.add(1))
  
        console.log({ rentingDetails })
      
        console.log(`data feed into the simpleRent contract. To make a functions request over the data,
          set the orderId to ${lastOrderId.add(1)} in the functions-request-config.js. So, the 
        `)
  })
