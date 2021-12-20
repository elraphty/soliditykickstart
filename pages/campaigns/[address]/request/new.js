import React from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../../../components/Layout';

function RequestNew(props) {
  const router = useRouter();

  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(props.address);

    setLoading(true);
    setErrorMessage('');

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });
        
      router.push(`/campaigns/${props.address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Link href={`/campaigns/${props.address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(event) =>
              setRecipient(event.target.value)
            }
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
}

export default RequestNew;

RequestNew.getInitialProps = (props) => {
  const { address } = props.query;

  return { address };
};
