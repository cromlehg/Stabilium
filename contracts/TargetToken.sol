pragma solidity ^0.5.0;

import "./CommonToken.sol";

/**
 * @title TargetToken
 */
contract TargetToken is CommonToken {

    constructor () public CommonToken(0xEA15Adb66DC92a4BbCcC8Bf32fd25E2e86a2A770, "Stabilium", "STB", 5000000000) {
    }
}
