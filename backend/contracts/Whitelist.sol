//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public maxWhitelistedAddresses; //Maximum addresses that can be whitelisted
    uint8 public numberOfWhitelistedAddress; // This will hold how many addresses have been whitelisted already.
    mapping (address => bool) public whitelistedAddresses; //This mapping will track the status if the address is whitelisted. 

    //@dev constructor will take an argument which is the maximum no of addresses that can be whitelisted at the time of deployment of the contract.
    constructor(uint8 _maxWhitelistedAddress) {
        maxWhitelistedAddresses = _maxWhitelistedAddress;
    }

    //@dev this function will add the caller of the function to whitelistedaddresses.
    function addToWhitelist() public {
        require(!whitelistedAddresses[msg.sender],"You are already whitelisted.");
        require(numberOfWhitelistedAddress < maxWhitelistedAddresses, "Whitelisted Address list is full.");
        whitelistedAddresses[msg.sender] = true;
        numberOfWhitelistedAddress += 1;
    }
}
