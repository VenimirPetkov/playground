// SPDX-License-Identifier: Unlicense

pragma solidity 0.8.14;

interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}