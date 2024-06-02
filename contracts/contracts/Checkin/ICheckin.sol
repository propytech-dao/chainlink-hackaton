// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ICheckin
 * @dev Interface for the Checkin contract
 */
interface ICheckin {
    /**
     * @notice Fulfill the check-in request
     * @param response The response containing the check-in status, nftAddress, and tokenID
     * @param err The error message if any
     */
    function fulfillRequest(bytes memory response, bytes memory err) external;
}
