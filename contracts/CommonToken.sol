pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title CommonToken
 * @dev Very simple ERC20 Token, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract CommonToken is ERC20, ERC20Detailed, Ownable {

    bool public lockPeriodFinished = false;

    mapping(address => bool) public lockFilter;

    /**
     * @dev Constructor that gives operator all of existing tokens.
     */
    constructor (address operator, string memory name, string memory ticker, uint256 count) public ERC20Detailed(name, ticker, 18) {
        _mint(operator, count * (10 ** uint256(decimals())));
        transferOwnership(operator);
    }

    modifier notLocked(address actor) {
        require(lockPeriodFinished || actor == owner() || lockFilter[actor], "You are not allowed to move tokens.");
        _;
    }

    function finishLockPeriod() public {
        require(!lockPeriodFinished, "Lock period has already finished");
        require(msg.sender == owner(), "You are not allowed to perform this action");
        lockPeriodFinished = true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) notLocked(sender) public returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    function transfer(address recipient, uint256 amount) notLocked(msg.sender) public returns (bool) {
        return super.transferFrom(msg.sender, recipient, amount);
    }

}
