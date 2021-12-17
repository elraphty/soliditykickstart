// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.2 <0.9.0;

import "./Kickstart.sol";

contract KickstartFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Kickstart(minimum, payable(msg.sender)));
        
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaigns;
    }
}




