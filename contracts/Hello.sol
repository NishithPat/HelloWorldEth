// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

contract Hello {
    string private word = "Hello";
    mapping(address => uint256) private balances;

    function setter(string memory _word) public {
        word = _word;
    }

    function getter() public view returns (string memory) {
        return word;
    }

    function deposit() public payable {
        balances[msg.sender] = balances[msg.sender] + msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(
            _amount <= balances[msg.sender],
            "cannot withdraw more than deposited"
        );
        balances[msg.sender] = balances[msg.sender] - _amount;
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "unable to withdraw");
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function BalanceAtAddress() public view returns (uint256) {
        return balances[msg.sender];
    }
}
