const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyERC1155 Unit Tests", function () {
  let provider;
  let MockNFT;
  let myERC721;

  before(async () => {
    // Set up provider
    //TODO: change this provider if another test network is being used
    provider = new ethers.providers.JsonRpcProvider("http://localhost:8545/");
  });

  it("should check the ETH balance of the address 0xCB149308B6be829fD580Ff1c84Fb6C44C373B3FB", async () => {
    //TODO: change this address when testing locally
    const addressToCheck = "0xCB149308B6be829fD580Ff1c84Fb6C44C373B3FB";
    const balance = await provider.getBalance(addressToCheck);
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(`Balance of address ${addressToCheck}: ${balanceInEth} ETH`);
    expect(balance.gt(0)).to.be.true;
  });

  it("should deploy an ERC721 contract", async () => {
    // Get the contract factory
    MockNFT = await ethers.getContractFactory("MockNFT");

    // Deploy the contract
    myERC721 = await MockNFT.deploy();
    await myERC721.deployed();

    console.log("MockNFT deployed to:", myERC721.address);

    // Verify the contract's deployment
    const name = await myERC721.name();
    const symbol = await myERC721.symbol();
    expect(name).to.equal("MockNFT");
    expect(symbol).to.equal("M721");
  });

  it("should mint an ERC721 token", async () => {
    const [owner] = await ethers.getSigners();

    // Mint a token to the owner's address
    const tx = await myERC721.mint(owner.address);
    await tx.wait();

    // Verify the token was minted
    const ownerOfToken = await myERC721.ownerOf(0);
    expect(ownerOfToken).to.equal(owner.address);
  });
});
