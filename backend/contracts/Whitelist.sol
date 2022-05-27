//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    uint public maxWhitelistedAddresses;
    uint private numberOfWhitelistedAddress;
    mapping (address => bool) public whitelistedAddresses;

    constructor(uint _maxWhitelistedAddress) {
        maxWhitelistedAddresses = _maxWhitelistedAddress;
    }

    function addToWhitelist() public {
        require(!whitelistedAddresses[msg.sender],"You are already whitelisted.");
        require(numberOfWhitelistedAddress < maxWhitelistedAddresses, "Whitelisted Address list is full.");
        whitelistedAddresses[msg.sender] = true;
        numberOfWhitelistedAddress += 1;
    }
}
