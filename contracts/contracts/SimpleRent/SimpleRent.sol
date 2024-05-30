// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SimpleRent
 * @dev This is a simplified renting protocol for ERC721 NFTs, not intended for production usage.
 *      It does not handle some edge cases to keep it simple.
 */

contract SimpleRent {
  struct Renting {
    address renter;
    address lender;
    uint256 rentValue; // per day
    uint256 rentDuration; // in days
    uint256 rentedAt;
    address rentToken;
  }
  mapping(bytes32 => Renting) public rentings;
  mapping(address => mapping(uint256 => address)) public tokenOwners; // nftAddress => tokenID => owner

  event Lent(
    address indexed nftAddress,
    uint256 indexed tokenID,
    address indexed renter,
    uint256 rentValue,
    address rentToken
  );
  event Rented(
    address indexed nftAddress,
    uint256 indexed tokenID,
    address indexed lender,
    uint256 rentValue,
    uint256 rentDuration
  );

  /**
   * @notice Lend an NFT for renting
   * @param nftAddress The address of the ERC721 token contract
   * @param tokenID The ID of the ERC721 token to lend
   * @param rentValue The rent value per day in the specified ERC20 token
   * @param rentToken The address of the ERC20 token used for rent payment
   */
  function lend(address nftAddress, uint256 tokenID, uint256 rentValue, address rentToken) external {
    IERC721 nft = IERC721(nftAddress);
    require(nft.ownerOf(tokenID) == msg.sender, "Caller is not the owner");
    require(tokenOwners[nftAddress][tokenID] == address(0), "Token is already lent");

    // Transfer the NFT to the SimpleRent contract. It keeps custody
    nft.transferFrom(msg.sender, address(this), tokenID);

    bytes32 identifier = keccak256(abi.encodePacked(nftAddress, tokenID));
    rentings[identifier] = Renting({
      renter: address(0),
      lender: msg.sender,
      rentValue: rentValue,
      rentDuration: 0,
      rentedAt: 0,
      rentToken: rentToken
    });

    tokenOwners[nftAddress][tokenID] = msg.sender;
    emit Lent(nftAddress, tokenID, msg.sender, rentValue, rentToken);
  }

  /**
   * @notice Rent a lent NFT
   * @param nftAddress The address of the ERC721 token contract
   * @param tokenID The ID of the ERC721 token to rent
   * @param rentDuration The duration of the rent in days
   */
  function rent(address nftAddress, uint256 tokenID, uint256 rentDuration) external {
    bytes32 identifier = keccak256(abi.encodePacked(nftAddress, tokenID));
    Renting storage renting = rentings[identifier];

    require(tokenOwners[nftAddress][tokenID] != address(0), "Token is not lent");
    require(renting.renter == address(0), "Token is already rented");

    IERC20 rentToken = IERC20(renting.rentToken);
    uint256 totalRentAmount = renting.rentValue * rentDuration;
    require(
      rentToken.transferFrom(msg.sender, tokenOwners[nftAddress][tokenID], totalRentAmount),
      "Rent payment failed"
    );

    renting.renter = msg.sender;
    renting.rentDuration = rentDuration;
    renting.rentedAt = block.timestamp;

    emit Rented(nftAddress, tokenID, msg.sender, totalRentAmount, rentDuration);
  }

  /**
   * @notice Get details of a rental
   * @param nftAddress The address of the ERC721 token contract
   * @param tokenID The ID of the ERC721 token
   * @return (address, address, uint256, uint256, uint256) Renter, lender, rent value, rent duration, rented at
   */
  function getRentalDetails(
    address nftAddress,
    uint256 tokenID
  ) external view returns (address, address, uint256, uint256, uint256) {
    bytes32 identifier = keccak256(abi.encodePacked(nftAddress, tokenID));
    Renting storage renting = rentings[identifier];
    return (renting.renter, renting.lender, renting.rentValue, renting.rentDuration, renting.rentedAt);
  }

  /**
   * @notice End the rent of an NFT
   * @param nftAddress The address of the ERC721 token contract
   * @param tokenID The ID of the ERC721 token
   */
  function endRent(address nftAddress, uint256 tokenID) external {
    require(tokenOwners[nftAddress][tokenID] == msg.sender, "Caller is not the owner");

    bytes32 identifier = keccak256(abi.encodePacked(nftAddress, tokenID));
    Renting storage renting = rentings[identifier];
    require(renting.lender == msg.sender, "Token is not lent");

    // Check if rent duration has expired
    require(block.timestamp >= renting.rentedAt + renting.rentDuration * 1 days, "Rent duration has not expired");

    // Transfer the NFT back to the proper owner
    IERC721 nft = IERC721(nftAddress);
    nft.transferFrom(address(this), msg.sender, tokenID);

    // Clear the renting data
    delete tokenOwners[nftAddress][tokenID];
    delete rentings[identifier];
  }
}
