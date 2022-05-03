// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  address public owner;
  // create a variable that represents the smart contract
  Token public token;
  // Redemtion rate = #amount of tokens they receive for 1 ether
  uint public rate;


  // we pass the token when we delpoy to the networks - token code and address
  // we need to update the deploy contracts for this constructor
  constructor(Token _token) {
    owner = msg.sender;
    token = _token;
    rate = 100;
  }

  receive() external payable {}

  fallback() external payable {}

  event BuyToken (address account, address token, uint amount, uint rate);
  event SellToken(address account, address token, uint amount, uint rate);

  // calculate ratio given by the amount of ether
  function ratioAmount(uint _amount) private view returns(uint) {
    require(_amount > 0, "You can not buy with 0");
    uint tokenAmount;
    tokenAmount = _amount * rate;
    return tokenAmount;
  }

  function buyTokens() public payable {
    uint amount = ratioAmount((msg.value));    
    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >=  amount , "You can't buy more tokens");
    token.transfer(msg.sender, amount);
    emit BuyToken(msg.sender, address(token), amount, rate);
  }

  function sellTokens(uint _amount) public {
    // User can't sell more tokens that they have
    require(token.balanceOf(msg.sender) >= _amount, "You can't sell the amount");

    // calculate the ether amount to redeem
    uint etherAmount = _amount / rate;

    // Require that EthSwap has enough tokens
    require((address(this).balance) >=  etherAmount , "Not enough tokens");

    // step give back DCT tokens
    token.transferFrom(msg.sender, address(this), _amount);
    // step give back ether
    payable(msg.sender).transfer(etherAmount);

    emit SellToken(msg.sender, address(token), _amount, rate);
  }
  
}
