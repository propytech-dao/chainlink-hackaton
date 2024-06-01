const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

const dotenv = require("dotenv");

dotenv.config({ path: '.env.test' });
const provider = ethers.getDefaultProvider(process.env.PROVIDER_URL);

console.log("provider url: " ,process.env.PROVIDER_URL)


describe("SimpleRent integration Unit Tests", function () {
  let MockNFT, mockNFT
  let MockUSDT, mockUSDT
  let SimpleRent, simpleRent
  let owner, renter

  before(async function () {
    [owner] = await ethers.getSigners()

    // Create a new wallet for the renter
    let renterWallet = ethers.Wallet.createRandom()

    // Connect the renter wallet to the provider
    renter = renterWallet.connect(ethers.provider)
  })

  it("should check the ETH balance of the address private key address", async () => {
    const [owner] = await ethers.getSigners()
    const addressToCheck = owner.address
    const balance = await provider.getBalance(addressToCheck)
    const balanceInEth = ethers.utils.formatEther(balance)
    console.log(`Balance of address ${addressToCheck}: ${balanceInEth} ETH`)
    expect(balance.gt(0)).to.be.true
  })

  it("should deploy an ERC721 contract", async () => {
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
  })

  it("should mint an ERC721 token", async () => {
    // Mint a token to the owner's address
    const tx = await mockNFT.safeMint(owner.address, "mockUri")
    await tx.wait()

    // Verify the token was minted
    const ownerOfToken = await mockNFT.ownerOf(0)
    expect(ownerOfToken).to.equal(owner.address)
  })

  it("should create the MockUSDT contract", async () => {
    // Get the contract factory and deploy the mock USDT contract
    MockUSDT = await ethers.getContractFactory("MockUSDT")
    mockUSDT = await MockUSDT.deploy(ethers.utils.parseUnits("1000000", 6)) // 1 million USDT with 6 decimals
    await mockUSDT.deployed()
  })

  it("should deploy the SimpleRent contract", async function () {
    SimpleRent = await ethers.getContractFactory("SimpleRent")
    simpleRent = await SimpleRent.deploy()
  })

  it("should lend the MockNFT", async function () {
    const tokenID = 0
    const nftAddress = mockNFT.address
    const rentValue = ethers.utils.parseUnits("10", 6) // 10 units with 6 decimals
    await mockNFT.connect(owner).approve(simpleRent.address, tokenID)
    await expect(await simpleRent.connect(owner).lend(nftAddress, tokenID, rentValue, mockUSDT.address))
      .to.emit(simpleRent, "Lent")
      .withArgs(nftAddress, tokenID, owner.address, rentValue, mockUSDT.address)

    // Check the NFT ownership is transferred to the SimpleRent contract
    expect(await mockNFT.ownerOf(tokenID)).to.equal(simpleRent.address)

    const rentingDetails = await simpleRent.getRentalDetails(nftAddress, tokenID)
    console.log({ rentingDetails })
  })

  it("should set up renter with mock tokens", async () => {
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
  })

  it("should allow renter to rent", async () => {
    {
      const nftAddress = mockNFT.address
      const tokenID = 0
      const rentDuration = 1 // in days
      const rentValue = ethers.utils.parseUnits("10", 6) // 10 units with 6 decimal
      const totalRentAmount = rentValue.mul(rentDuration)

      // Rent the NFT
      await expect(await simpleRent.connect(renter).rent(nftAddress, tokenID, rentDuration))
        .to.emit(simpleRent, "Rented")
        .withArgs(nftAddress, tokenID, renter.address, totalRentAmount, rentDuration)

      // Verify that the renting details are correct
      const rentingDetails = await simpleRent.getRentalDetails(nftAddress, tokenID)

      console.log({ rentingDetails })
    }
  })
})
