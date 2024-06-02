// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../SimpleRent/SimpleRent.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ICheckin} from "./ICheckin.sol";

/**
 * @title Checkin
 * @dev This contract handles the check-in process for rented properties inside the SimpleRent contract
 */
contract SimpleRentCheckin is FunctionsClient, ConfirmedOwner{
      using FunctionsRequest for FunctionsRequest.Request;

    SimpleRent public simpleRent;
    
    enum Status { WAITING, APPROVED, DISAPPROVED }

    struct CheckinDetails {
        address nftAddress;
        uint256 tokenId;
        Status status;
        address renterAddress;
    }

  // This maps lastOrderId inside SimpleRent to the checkins.
  mapping(uint256 => CheckinDetails) public checkins;

  bytes32 public donId; // DON ID for the Functions DON to which the requests are sent

  bytes32 public s_lastRequestId;
  bytes public s_lastResponse;
  bytes public s_lastError;

event CheckinValidated(bytes32 indexed requestId, bool status, bytes errorMessage);

    constructor(address router, bytes32 _donId, address simpleRentAddress) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        donId = _donId;
        simpleRent = SimpleRent(simpleRentAddress);
    }

  /**
   * @notice Set the DON ID
   * @param newDonId New DON ID
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    donId = newDonId;
  }


  /**
   * @notice Triggers an on-demand Functions request using remote encrypted secrets
   * @param source JavaScript source code
   * @param secretsLocation Location of secrets (only Location.Remote & Location.DONHosted are supported)
   * @param encryptedSecretsReference Reference pointing to encrypted secrets
   * @param args String arguments passed into the source code and accessible via the global variable `args`
   * @param bytesArgs Bytes arguments passed into the source code and accessible via the global variable `bytesArgs` as hex strings
   * @param subscriptionId Subscription ID used to pay for request (FunctionsConsumer contract address must first be added to the subscription)
   * @param callbackGasLimit Maximum amount of gas used to call the inherited `handleOracleFulfillment` method
   */
  function sendRequest(
    string calldata source,
    FunctionsRequest.Location secretsLocation,
    bytes calldata encryptedSecretsReference,
    string[] calldata args,
    bytes[] calldata bytesArgs,
    uint64 subscriptionId,
    uint32 callbackGasLimit
  ) external {

    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
    req.secretsLocation = secretsLocation;
    req.encryptedSecretsReference = encryptedSecretsReference;
    if (args.length > 0) {
      req.setArgs(args);
    }
    if (bytesArgs.length > 0) {
      req.setBytesArgs(bytesArgs);
    }
    s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, callbackGasLimit, donId);
  }


    /**
     * @notice Fulfill the check-in request
     * @param response The response containing the check-in status, nftAddress, and tokenID
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {

        if (response.length > 0) {
            (
                uint256 orderId,
                bool status
            ) = abi.decode(response, (uint256, bool));
        
        (address liveRenter, , , , ) = simpleRent.getRentalDetails(orderId);
        //TODO: may it is not necessary to check live renter here. Make the guess later...  


       // Set the status based on the decoded value
        if (status) {
            checkins[orderId].status = Status.APPROVED;
        } else {
            checkins[orderId].status = Status.DISAPPROVED;
        }

        emit CheckinValidated(requestId, status, err);
        }
    }

  
}
