import { useState } from 'react';
import { Container, Button, Card, Form } from 'semantic-ui-react';
import tokenLogo from '../token-logo.png';
import ethLogo from '../eth-logo.png';

const Buy = ({ web3, investorBalance, tokenBalance, buyTokens }) => {
  const [ethAmount, setEthAmount] = useState('0');
  const [output, setOutput] = useState('0');

  const handleSubmit = (e) => {
    e.preventDefault();
    buyTokens(web3.utils.toWei(ethAmount));
  };

  const handleChange = (e) => {
    setEthAmount(e.target.value);
    setOutput(e.target.value * 100);
  };

  return (
    <div id='buy'>
      <Container>
        <Card style={{ width: '100%' }}>
          <Form
            onSubmit={handleSubmit}
            style={{ padding: '20px', backgroundColor: 'rgba(33,186,69,0.2)' }}
          >
            <Form.Field>
              <label>
                <b>Input ETH</b>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <input
                  style={{ width: '300px' }}
                  type='text'
                  placeholder='0'
                  onChange={handleChange}
                  required
                />
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Balance: {web3.utils.fromWei(investorBalance, 'Ether')}{' '}
                  <span style={{ marginRight: '20px' }}>&nbsp; ETH</span>
                  <img src={ethLogo} height='32' alt='' />
                </span>
              </div>
            </Form.Field>
            <Form.Field>
              <label>
                <b>Output</b>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <input
                  style={{ width: '300px' }}
                  type='text'
                  className=''
                  placeholder='0'
                  value={output}
                  disabled
                />
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Balance: {web3.utils.fromWei(tokenBalance, 'Ether')}
                  <span style={{ marginRight: '20px' }}>&nbsp; DCT</span>
                  <img
                    src={tokenLogo}
                    height='32'
                    alt=''
                    style={{ borderRadius: '50%' }}
                  />
                </span>
              </div>
            </Form.Field>
            <div
              style={{
                display: 'flex',
                marginBottom: '15px',
              }}
            >
              <span>Exchange Rate:&nbsp; </span>
              <span>1 ETH = 100 DCT</span>
            </div>
            <Button type='submit' color='teal'>
              Swap
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Buy;
