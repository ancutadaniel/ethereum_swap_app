import React, { useCallback, useEffect, useState } from 'react';
import getWeb3 from './utils/getWeb3';

import EthSwap from '../src/build/abi/EthSwap.json';
import Token from '../src/build/abi/Token.json';
import MainMenu from './components/Menu';
import Swap from './components/Swap';

import {
  Container,
  Divider,
  Dimmer,
  Loader,
  Segment,
  Message,
} from 'semantic-ui-react';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contractEthSwap, setContractEthSwap] = useState({});
  const [contractToken, setContractToken] = useState({});
  const [web3, setWeb3] = useState({});
  const [investorBalance, setInvestorBalance] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [errors, setErrors] = useState();

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const getAccounts = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const newEthSwapData = await EthSwap.networks[getNetworkId];
        const newTokenData = await Token.networks[getNetworkId];
        // load ethSwap balance
        const investorEthBalance = await web3.eth.getBalance(getAccounts[0]);
        // check contract deployed networks
        if (newEthSwapData && newTokenData) {
          // get contract deployed address
          const contractSwapAddress = newEthSwapData.address;
          const contractTokenAddress = newTokenData.address;
          // create a new instance of the contract - on that specific address
          const contractSwapData = await new web3.eth.Contract(
            EthSwap.abi,
            contractSwapAddress
          );
          const contractTokenData = await new web3.eth.Contract(
            Token.abi,
            contractTokenAddress
          );

          const getTokenBalance = await contractTokenData.methods
            .balanceOf(getAccounts[0])
            .call();

          setContractEthSwap(contractSwapData);
          setContractToken(contractTokenData);
          setTokenBalance(getTokenBalance);
        } else {
          alert('Smart contract not deployed to selected network');
        }
        setWeb3(web3);
        setAccounts(getAccounts);
        setInvestorBalance(investorEthBalance);
        setLoading(false);
      }
    } catch (error) {
      setErrors(error);
    }
  };

  const buyTokens = async (ethAmount) => {
    setLoading(true);
    try {
      await contractEthSwap.methods
        .buyTokens()
        .send({ from: accounts[0], value: ethAmount });

      updateData();
      setLoading(false);
    } catch (error) {
      setErrors(error);
    }
    setLoading(false);
  };

  const sellTokens = async (tokenAmount) => {
    setLoading(true);
    try {
      // investor must approve the tokens before sell
      await contractToken.methods
        .approve(contractEthSwap.options.address, tokenAmount)
        .send({ from: accounts[0] });

      // sell tokens
      await contractEthSwap.methods
        .sellTokens(tokenAmount)
        .send({ from: accounts[0] });

      updateData();
      setLoading(false);
    } catch (error) {
      setErrors(error);
    }
  };

  const updateData = useCallback(async () => {
    try {
      // update new balance
      if (accounts.length > 0 && contractToken) {
        const getTokenBalance = await contractToken.methods
          .balanceOf(accounts[0])
          .call();

        const investorEthBalance = await web3.eth.getBalance(accounts[0]);

        setTokenBalance(getTokenBalance);
        setInvestorBalance(investorEthBalance);
      }
    } catch (error) {
      setErrors(error);
    }
  }, [accounts, contractToken, web3.eth]);

  useEffect(() => {
    if (contractToken) updateData();
  }, [contractToken, updateData]);

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App'>
      <MainMenu account={accounts[0]} />
      <Divider horizontal>§</Divider>
      <Container>
        {loading ? (
          <Segment style={{ height: 150 }}>
            <Dimmer active>
              <Loader>Loading</Loader>
            </Dimmer>
          </Segment>
        ) : (
          <Swap
            web3={web3}
            investorBalance={investorBalance}
            tokenBalance={tokenBalance}
            buyTokens={buyTokens}
            sellTokens={sellTokens}
          />
        )}
        {errors && (
          <Message negative>
            <Message.Header>Code: {errors?.code}</Message.Header>
            <p>Error: {errors?.message}</p>
          </Message>
        )}
      </Container>
    </div>
  );
};

export default App;
