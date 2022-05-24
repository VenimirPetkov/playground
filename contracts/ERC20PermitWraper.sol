// SPDX-License-Identifier: MIT
// @autor Venimir Petkov

pragma solidity ^0.8.0;

import "../libraries/ECDSA.sol";
import "../libraries/SafeERC20.sol";
import "./Context.sol";

contract ERC20PermitWraper is Context {
    using ECDSA for bytes32;

    IERC20 public immutable underlying;

    bool private _locked;
    mapping(address => uint256) private _nonce;
    bytes32 public immutable TRANSFER_WITH_PERMIT = keccak256('transferWithPermit(bytes memory signature, address from, address to, uint256 amount, uint256 deadline)');
    
    modifier noReentrancy() {
        require(!_locked, "No re-entrancy");
        _locked = true;
        _;
        _locked = false;
    }

    constructor(address underlyingToken){
        underlying = IERC20(underlyingToken);
    }

    function transferWithPermit(bytes memory signature, address from, address to, uint256 amount, uint256 deadline) external noReentrancy {
        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
        bytes memory payload = abi.encode(TRANSFER_WITH_PERMIT, to, amount, deadline, _getNonce(from));
        address signatureAddress = keccak256(payload).toEthSignedMessageHash().recover(signature);
        require(from == signatureAddress, "ERC20Permit: Failed to verify signature");
        SafeERC20.safeTransferFrom(underlying, from, to, amount);
        _nonce[from] += 1;
    }

    function getNonce() external view returns(uint256){
        return _getNonce(_msgSender());
    }

    function _getNonce(address account) private view returns(uint256){
        return _nonce[account];
    }
    
    function getPayload(address from, address to, uint256 amount, uint256 deadline) external view returns(bytes memory){
        return abi.encode(TRANSFER_WITH_PERMIT, to, amount, deadline, _getNonce(from));
    }
}