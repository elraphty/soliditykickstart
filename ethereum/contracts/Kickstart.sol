// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.2 <0.9.0;

contract Kickstart {

    struct Request   {
      string  description;
      uint value;
      address payable recipient;
      bool complete;
      uint approvalCount;
      mapping(address => bool) approvals;
    }
    
    mapping(uint => Request) public requests;
    uint private currentIndex;
    
    address payable public manager;
    uint public minimumContribution;
    mapping(address  => bool) public approvers;
    uint public approversCount;

    modifier restricted  {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address payable creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, 'To contribute you need to atleast pay minimumContribution ${minimumContribution}');
        
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint256 value, address payable recipient) external restricted {
        Request storage request = requests[currentIndex];

        request.description = description;
        request.value = value;
        request.recipient = recipient;
        request.complete = false;

        // Set the request approval count to 0
        request.approvalCount = 0;

        currentIndex++;
    }

    function approveRequest(uint indexOfRequest) external {
        Request storage request = requests[indexOfRequest];
        
        // The user must be among the approvers, and must have not approved the request before
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;

        // increase the request approval count
        request.approvalCount++;
    }
}