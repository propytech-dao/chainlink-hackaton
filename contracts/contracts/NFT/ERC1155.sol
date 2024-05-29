// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyERC1155 is ERC1155 {
    constructor() ERC1155("https://myapi.com/metadata/{id}.json") {
        // Mint 100 tokens of token type 1 to msg.sender
        _mint(msg.sender, 1, 100, "");
    }
}