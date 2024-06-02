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
  struct Rental {
    uint256 orderId;
    address renter;
    address nftAddress;
    uint256 tokenId;
    address lender;
    uint256 rentValue; // per day
    uint256 rentDuration; // in days
    uint256 rentedAt;
    address rentToken;
  }
  mapping(uint256 => Rental) public rentals;
  mapping(address => mapping(uint256 => address)) public tokenOwners; // nftAddress => tokenID => owner
  uint256 public lastOrder = 0;


  event Lent(
    uint256 indexed orderId,
    address indexed nftAddress,
    uint256 indexed tokenID,
    address lender,
    uint256 rentValue,
    address rentToken
  );
  event Rented(
    uint256 indexed orderId,
    address indexed nftAddress,
    uint256 indexed tokenID,
    address renter,
    uint256 totalRentAmount,
    uint256 rentDuration
  );

  /**
   * @notice Lend an NFT for renting
   * @param nftAddress The address of the ERC721 token contract
   * @param tokenId The ID of the ERC721 token to lend
   * @param rentValue The rent value per day in the specified ERC20 token
   * @param rentToken The address of the ERC20 token used for rent payment
   */
  function lend(address nftAddress, uint256 tokenId, uint256 rentValue, address rentToken) external {
    IERC721 nft = IERC721(nftAddress);
    require(nft.ownerOf(tokenId) == msg.sender, "Caller is not the owner");
    require(tokenOwners[nftAddress][tokenId] == address(0), "Token is already lent");

    // Transfer the NFT to the SimpleRent contract. It keeps custody
    nft.transferFrom(msg.sender, address(this), tokenId);

    lastOrder +=1;
    rentals[lastOrder] = Rental({
      orderId: lastOrder,
      renter: address(0),
      lender: msg.sender,
      nftAddress: nftAddress,
      tokenId: tokenId,
      rentValue: rentValue,
      rentDuration: 0,
      rentedAt: 0,
      rentToken: rentToken
    });

    tokenOwners[nftAddress][tokenId] = msg.sender;
    emit Lent(lastOrder, nftAddress, tokenId, msg.sender, rentValue, rentToken);
  }

  /**
   * @notice Rent a lent NFT
   * @param _orderId The ID of the created Rental order
   * @param rentDuration The duration of the rent in days
   */
  function rent(uint256 _orderId, uint256 rentDuration) external {
    Rental storage rental = rentals[_orderId];
    address nftAddress = rental.nftAddress;
    uint256 tokenId = rental.tokenId;
    require(tokenOwners[nftAddress][tokenId] != address(0), "Token is not lent");
    require(rental.renter == address(0), "Token is already rented");

    IERC20 rentToken = IERC20(rental.rentToken);
    uint256 totalRentAmount = rental.rentValue * rentDuration;
    require(
      rentToken.transferFrom(msg.sender, tokenOwners[nftAddress][tokenId], totalRentAmount),
      "Rent payment failed"
    );

    rental.renter = msg.sender;
    rental.rentDuration = rentDuration;
    rental.rentedAt = block.timestamp;

    emit Rented(_orderId, nftAddress, tokenId ,msg.sender, totalRentAmount, rentDuration);
  }

  /**
   * @notice Get details of a rental
   * @param orderId The ID of the created Rental order
   * @return (address, address, uint256, uint256, uint256) Renter, lender, rent value, rent duration, rented at
   */
  function getRentalDetails(
    uint256 orderId
  ) external view returns (address, address, uint256, uint256, uint256) {
    Rental storage rental = rentals[orderId];
    return (rental.renter, rental.lender, rental.rentValue, rental.rentDuration, rental.rentedAt);
  }

  /**
   * @notice End the rent of an NFT
   * @param orderId The ID of the created Rental order
   */
  function endRent(uint256 orderId) external {
    Rental storage rental = rentals[orderId];
    address nftAddress = rental.nftAddress;
    uint256 tokenId = rental.tokenId;
    require(tokenOwners[nftAddress][tokenId] == msg.sender, "Caller is not the owner of nft");
    require(rental.lender == msg.sender, "Token is not lent");

    // Check if rent duration has expired
    require(block.timestamp >= rental.rentedAt + rental.rentDuration * 1 days, "Rent duration has not expired");

    // Transfer the NFT back to the proper owner
    IERC721 nft = IERC721(nftAddress);
    nft.transferFrom(address(this), msg.sender, tokenId);

    // Clear the renting data
    delete tokenOwners[nftAddress][tokenId];
  }
}
