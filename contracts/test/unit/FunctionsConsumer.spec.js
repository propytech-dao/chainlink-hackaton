const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

const provider = ethers.getDefaultProvider("http://localhost:8545/")

describe("MyERC1155 Unit Tests", function () {
  let MockNFT
  let myERC721
  let MockUSDT, mockUSDT
  let Resolver, resolver
  let Registry, registry
  let owner,  renter;

  before(async function () {
    [owner] = await ethers.getSigners();

        // Create a new wallet for the renter
        let renterWallet = ethers.Wallet.createRandom();

        // Connect the renter wallet to the provider
        renter = renterWallet.connect(ethers.provider);
  });


  it("should check the ETH balance of the address 0xCB149308B6be829fD580Ff1c84Fb6C44C373B3FB", async () => {
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
    myERC721 = await MockNFT.deploy(owner.address)
    await myERC721.deployed()

    console.log("MockNFT deployed to:", myERC721.address)

    // Verify the contract's deployment
    const name = await myERC721.name()
    const symbol = await myERC721.symbol()
    expect(name).to.equal("MockNFT")
    expect(symbol).to.equal("MTK")
  })

  it("should mint an ERC721 token", async () => {
    // Mint a token to the owner's address
    const tx = await myERC721.safeMint(owner.address, "mockUri")
    await tx.wait()

    // Verify the token was minted
    const ownerOfToken = await myERC721.ownerOf(0)
    expect(ownerOfToken).to.equal(owner.address)
  })

  it("should create the MockUSDT contract", async () => {
    // Get the contract factory and deploy the mock USDT contract
    MockUSDT = await ethers.getContractFactory("MockUSDT")
    mockUSDT = await MockUSDT.deploy(ethers.utils.parseUnits("1000000", 6)) // 1 million USDT with 6 decimals
    await mockUSDT.deployed()
  })

  it("should deploy the Resolver contract", async function () {
    Resolver = await ethers.getContractFactory("Resolver")
    resolver = await Resolver.deploy(owner.address)
    await resolver.deployed()
    await resolver.setPaymentToken(1, mockUSDT.address)
    expect(await resolver.getPaymentToken(1)).to.equal(mockUSDT.address)
  })

  it("should deploy the Registry contract", async function () {
    const [owner] = await ethers.getSigners()
    Registry = await ethers.getContractFactory("Registry")
    registry = await Registry.deploy(resolver.address, owner.address, owner.address)
    await registry.deployed()

    // Verify the Registry contract's state
    expect(await registry.paused()).to.be.false
    expect(await registry.rentFee()).to.equal(0)
  })

  it("should lend the MockNFT", async function () {
    // Approve the registry contract to transfer the NFT
    await myERC721.setApprovalForAll(registry.address, true)

    // Define the parameters for the lend function
    const nftStandard = [0] // ERC721
    const nftAddress = [myERC721.address]
    const tokenID = [0]
    const lendAmount = [1]
    const maxRentDuration = [10]
    // It has to pad to make it work properly 
    // this is 4 USDT
    const dailyRentPrice = [ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.parseUnits("1", 6)), 4)]
    const paymentToken = [1] // MockUSDT
    const willAutoRenew = [false]

    // Call the lend function
    const lendTx = await registry.lend(
      nftStandard,
      nftAddress,
      tokenID,
      lendAmount,
      maxRentDuration,
      dailyRentPrice,
      paymentToken,
      willAutoRenew
    )
    await lendTx.wait()

    // Verify that the lend function was executed correctly
    const lendingData = await registry.getLending(myERC721.address, 0, 1)
    console.log("lending data:", { lendingData })
    expect(lendingData[0]).to.equal(0) // nftStandard (ERC721)
    expect(lendingData[1]).to.equal(owner.address) // lenderAddress
    expect(lendingData[2]).to.equal(10) // maxRentDuration
    expect(lendingData[3]).to.equal(dailyRentPrice[0]) // dailyRentPrice
    expect(lendingData[4]).to.equal(lendAmount[0]) // lendAmount
    expect(lendingData[5]).to.equal(lendAmount[0]) // availableAmount
    expect(lendingData[6]).to.equal(1) // paymentToken (MockUSDT)
  })


  it("should set up renter with mock tokens", async () =>{

 // Fund the renter wallet with some ETH from the owner
 await owner.sendTransaction({
  to: renter.address,
  value: ethers.utils.parseEther("1.0") // Send 1 ETH
  })
  // Fund the renter with some MockUSDT
  await mockUSDT.transfer(renter.address, ethers.utils.parseUnits("1000", 6));

  // renter approves ERC20 token for the registry to use
  await mockUSDT.connect(renter).approve(registry.address, ethers.utils.parseUnits("1000", 6));

   // Verify renter balances and approvals
   const renterEthBalance = await ethers.provider.getBalance(renter.address);
   const renterUsdtBalance = await mockUSDT.balanceOf(renter.address);
   const renterAllowance = await mockUSDT.allowance(renter.address, registry.address);

   expect(renterEthBalance).to.be.above(ethers.utils.parseEther("0.9")); // Accounting for gas fees
   expect(renterUsdtBalance).to.equal(ethers.utils.parseUnits("1000", 6));
   expect(renterAllowance).to.equal(ethers.utils.parseUnits("1000", 6));
  })

  it("should call the rent function and verify renting data", async function () {
    // Approve the renter to spend MockUSDT
    await mockUSDT.connect(renter).approve(registry.address, ethers.utils.parseUnits("10", 6));

    // Define the parameters for the rent function
    const nftStandard = [0]; // ERC721
    const nftAddress = [myERC721.address];
    const tokenID = [0];
    const lendingID = [1];
    const rentDuration = [5]; // Renting for 5 days
    const rentAmount = [1];

    // Fund the renter with some MockUSDT
    await mockUSDT.transfer(renter.address, ethers.utils.parseUnits("10", 6));

    // Call the rent function with a manual gas limit
    const gasLimit = 500000; // Adjust this value as needed

    const rentTx = await registry.connect(renter).rent(
      nftStandard,
      nftAddress,
      tokenID,
      lendingID,
      rentDuration,
      rentAmount,
      { gasLimit }
    );
    await rentTx.wait();

    // Verify that the rent function was executed correctly
    // Add specific assertions here to check the state of the contract after renting
    // For example, you can call getRenting to verify the renting data if such a function exists
  });
})
