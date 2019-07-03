pragma solidity ^0.5.0;

import "../token/ERC20/ERC20.sol";
import "../token/ERC20/ERC20Detailed.sol";
import "../ownership/Ownable.sol";

/**
 * @title TargetToken
 * @dev Very simple ERC20 Token, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract TargetToken is ERC20, ERC20Detailed, Ownable {

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor (address operator, string name, string ticker, uint256 count) public ERC20Detailed(name, ticker, 18) {
        _mint(operator, count * (10 ** uint256(decimals())));
	transferOwnership(operator);
    }
}
