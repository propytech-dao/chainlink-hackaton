// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../SimpleRent/SimpleRent.sol";

/**
 * @title Checkin
 * @dev This contract handles the check-in process for rented properties.
 */
contract Checkin {
    SimpleRent public simpleRent;
    address public allowedCaller;

    event CheckinValidated(address indexed nftAddress, uint256 indexed tokenID, bool status);

    /**
     * @notice Constructor to set the allowed caller and the SimpleRent contract address
     * @param _allowedCaller Address of the contract allowed to call CheckInFulfill
     * @param simpleRentAddress Address of the SimpleRent contract
     */
    constructor(address _allowedCaller, address simpleRentAddress) {
        allowedCaller = _allowedCaller;
        simpleRent = SimpleRent(simpleRentAddress);
    }

    /**
     * @notice Fulfill the check-in request
     * @param response The response containing the check-in status, nftAddress, and tokenID
     */
    function checkInFulfill(bytes memory response) external {
        require(msg.sender == allowedCaller, "Caller is not allowed");

        // Assuming the response is structured as: abi.encode(bool status, address nftAddress, uint256 tokenID)
        (bool status, address nftAddress, uint256 tokenID) = abi.decode(response, (bool, address, uint256));

        // Validate the check-in with SimpleRent contract
        require(simpleRent.tokenOwners(nftAddress, tokenID) != address(0), "Invalid NFT address or tokenID");

        emit CheckinValidated(nftAddress, tokenID, status);
    }
}
