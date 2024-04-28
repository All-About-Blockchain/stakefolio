const express = require('express');
const { Connection } = require('@solana/web3.js');
const {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
} = require('@pythnetwork/client');

const PYTHNET_CLUSTER_NAME = PythCluster.pythnet;
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

const app = express();

import { Request, Response } from 'express';

interface PythData {
  // Define the structure of the Pyth data here
}

app.get('/api/pyth', async (req: Request, res: Response) => {
  try {
    const pythClient = new PythHttpClient(connection, pythPublicKey);
    const data = await pythClient.getData();
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
