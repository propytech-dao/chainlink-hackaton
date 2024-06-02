// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MockUSDT is ERC20, ERC20Burnable {
  constructor(uint256 initialSupply) ERC20("Mock USDT", "USDT") {
    _mint(msg.sender, initialSupply);
  }

  // Function to mint tokens, only for testing purposes
  function mint(address to, uint256 amount) external {
    _mint(to, amount);
  }
}
