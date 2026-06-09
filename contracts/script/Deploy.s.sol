// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ClaimrPOAP} from "../src/ClaimrPOAP.sol";

/**
 * Deploys ClaimrPOAP with the broadcasting wallet as both admin and minter.
 *
 * Usage:
 *   forge script script/Deploy.s.sol:DeployClaimrPOAP \
 *     --rpc-url monad_testnet --broadcast --private-key $PRIVATE_KEY
 */
contract DeployClaimrPOAP is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);
        ClaimrPOAP poap = new ClaimrPOAP(deployer, deployer);
        vm.stopBroadcast();

        console.log("ClaimrPOAP deployed at:", address(poap));
        console.log("Admin + Minter:", deployer);
    }
}
