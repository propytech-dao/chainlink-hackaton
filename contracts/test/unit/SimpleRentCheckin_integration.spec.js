const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

const dotenv = require("dotenv");

dotenv.config({ path: '.env.test' });
const provider = ethers.getDefaultProvider(process.env.PROVIDER_URL);
const checkinAddress = process.env.CHECKIN_ADDRESS; 


describe("SimpleRentCheckin integration tests", function () {
  let MockNFT, mockNFT
  let MockUSDT, mockUSDT
  let SimpleRent, simpleRent
  let owner, renter
})
