// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ClaimrPOAP} from "../src/ClaimrPOAP.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract ClaimrPOAPTest is Test {
    ClaimrPOAP poap;

    address admin = address(0xA11CE);
    address minter = address(0xB0B);
    address alice = address(0x1111);
    address bob = address(0x2222);

    bytes32 eventId = keccak256("evt_monad_blitz_nyc");
    string uri = "ipfs://bafytest/metadata.json";

    function setUp() public {
        poap = new ClaimrPOAP(admin, minter);
    }

    function test_Constructor_GrantsRoles() public view {
        assertTrue(poap.hasRole(poap.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(poap.hasRole(poap.MINTER_ROLE(), minter));
    }

    function test_MintClaim_MintsToRecipient() public {
        vm.prank(minter);
        uint256 tokenId = poap.mintClaim(alice, eventId, uri);

        assertEq(poap.ownerOf(tokenId), alice);
        assertEq(poap.tokenURI(tokenId), uri);
        assertEq(poap.eventOf(tokenId), eventId);
        assertTrue(poap.hasClaimed(eventId, alice));
        assertEq(poap.eventClaims(eventId), 1);
        assertEq(poap.totalMinted(), 1);
    }

    function test_MintClaim_RevertsOnDoubleClaim() public {
        vm.startPrank(minter);
        poap.mintClaim(alice, eventId, uri);
        vm.expectRevert(
            abi.encodeWithSelector(ClaimrPOAP.AlreadyClaimed.selector, eventId, alice)
        );
        poap.mintClaim(alice, eventId, uri);
        vm.stopPrank();
    }

    function test_MintClaim_AllowsDifferentEventSameWallet() public {
        bytes32 eventId2 = keccak256("evt_monad_blitz_lisbon");
        vm.startPrank(minter);
        poap.mintClaim(alice, eventId, uri);
        poap.mintClaim(alice, eventId2, uri);
        vm.stopPrank();
        assertEq(poap.totalMinted(), 2);
    }

    function test_MintClaim_RevertsForNonMinter() public {
        bytes32 minterRole = poap.MINTER_ROLE();
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                alice,
                minterRole
            )
        );
        vm.prank(alice);
        poap.mintClaim(alice, eventId, uri);
    }

    function test_Soulbound_BlocksTransfer() public {
        vm.prank(minter);
        uint256 tokenId = poap.mintClaim(alice, eventId, uri);

        vm.prank(alice);
        vm.expectRevert(ClaimrPOAP.Soulbound.selector);
        poap.transferFrom(alice, bob, tokenId);
    }

    function test_MintClaim_RevertsOnZeroAddress() public {
        vm.prank(minter);
        vm.expectRevert(ClaimrPOAP.ZeroAddress.selector);
        poap.mintClaim(address(0), eventId, uri);
    }
}
