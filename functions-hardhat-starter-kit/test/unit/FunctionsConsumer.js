const { assert } = require("chai");
const { ethers } = require("hardhat")

describe("MyERC1155 Unit Tests", async function () {

  it("should check the ETH balance of the address 0xCB149308B6be829fD580Ff1c84Fb6C44C373B3FB", async () => {
    const addressToCheck = "0xCB149308B6be829fD580Ff1c84Fb6C44C373B3FB";
    const balance = await ethers.getBalance(addressToCheck);
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(`Balance of address ${addressToCheck}: ${balanceInEth} ETH`);
    expect(assert.isTrue(balanceInEth.gre))
  });

  it("should deploy the ERC1155 contract and check the balance of the owner", async () => {
    const MyERC1155 = await ("MyERC1155");
    
    const [owner] = await ethers.getSigners();
    const myERC1155 = await MyERC1155.deploy();
    await myERC1155.deployed();
    
    
    const balance = await myERC1155.balanceOf(owner.address, 1);
    assert.equal(balance.toString(), "100", "Owner should have 100 tokens of type 1");
  });
});