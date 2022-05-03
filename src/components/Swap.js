import { useState } from 'react';
import { Container, Button } from 'semantic-ui-react';
import Buy from './Buy';
import Sell from './Sell';

const Swap = ({
  web3,
  investorBalance,
  tokenBalance,
  buyTokens,
  sellTokens,
}) => {
  const [currentForm, setCurrentForm] = useState('buy');

  const handleStatus = (e) => {
    setCurrentForm(e.target.name);
  };

  return (
    <div id='swap'>
      <Button.Group style={{ display: 'flex', marginBottom: '20px' }}>
        <Button name='buy' onClick={handleStatus} color='green'>
          Buy
        </Button>
        <Button.Or />
        <Button name='sell' onClick={handleStatus} color='violet'>
          Sell
        </Button>
      </Button.Group>

      <Container>
        {currentForm === 'buy' ? (
          <Buy
            web3={web3}
            investorBalance={investorBalance}
            tokenBalance={tokenBalance}
            buyTokens={buyTokens}
          />
        ) : (
          <Sell
            web3={web3}
            investorBalance={investorBalance}
            tokenBalance={tokenBalance}
            sellTokens={sellTokens}
          />
        )}
      </Container>
    </div>
  );
};

export default Swap;
