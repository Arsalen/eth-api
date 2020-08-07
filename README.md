# eth-api

Second out of three components of the ethereum-oracle-api-dapp project:
  - ethereum oracle
  - [ethereum API server](https://github.com/Arsalen/eth-api)
  - [ethereum sample dapp](https://github.com/Arsalen/eth-forex-dapp)

## Overview

A RESTfull API server that accepts signed updates about [a foreign exchange](http://freeforexapi.com/) market price rates from several ethereum oracles and forward transactions to a sample dapp deployed on [ropsten](https://ropsten.etherscan.io/).

Concurrent transactions from multiple sources are stored in a RabbitMQ exchange then piped to the application through stream objects.

### What is an oracle?

An oracle is a service that provides “trusted” data to a smart contract, through transactions. “Trusted” because, trust is a personal issue. Two entities might not “trust” data in the same way, given some specific implementation of an oracle.

Oracles are typically web services that implement some blockchain-specific functionalities, such as hashing and signing some data, or creating and submitting new transactions to the network.

## Components

Authentication, streaming and forwarding of messages are controlled by a wide range of services, helpers and common utilities, we name a few for simplicity:
  - User controller: A web service that manage oracle registration through basic auth.
  - Broker: A readable stream object, first initiate an exchange if it does not exist, asserts a queue once a new oracle is registred to the application, forward requests based on their keys, pipe messages to the control loop.
  - Pair controller: A web service to handle updates from oracles.
  - Control loop: A writable stream object, constantly subscribed to the broker, handle the flow of incoming messages, submit updates to the blockchain.
  - Helpers: Manage connections with end points, database and Infura.
  - Commons: Manage cron, logs, format and signature services. 
  - Middelwares: Manage authentication and signature of messages.

![alt text](https://github.com/Arsalen/eth-api/blob/master/architecture.jpg?raw=true)

## Prerequisites

On a [ubuntu server](https://releases.ubuntu.com/18.04/), install [PM2](https://pm2.keymetrics.io/) to launch the oracle as a daemon service, [RabbitMQ](https://www.rabbitmq.com/) to store messages in their respective queues.
On [Infura](https://infura.io/), setup a new project to connect to ropsten.
On [MEW](https://www.myetherwallet.com/), generate a wallet through a mnemonic phrase, download keystore file and fund the address with some [fake ether](https://faucet.ropsten.be/).

### Configuration

Configuration and secret files are omitted, you can though setup your own if you have managed to follow the prerequisites.

.env

```INI
PORT=3000 # Server port

MNEMONIC="one two three four five six seven eight nine ten eleven twelve" # Mnemonic passphrase

SECRET="a1B2c3D4e5F6g7H"  # Secret to decrypt keystore
```

app.process.js

```JS
module.exports = {
    apps: [{
        name: 'eth-api',
        script: 'app.js',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
    }]
};
```

config/app.config.json

```JSON
{
    "broker": {
        "endPoint": "amqp://<ip>", // Broker ip address
        "exchange": "application",
        "type": "direct"
    },
    "infura": {
        "endPoint": "https://ropsten.infura.io/v3/",
        "key": "abcd1efgh2ijkl3mnop4qrst5uvwx6yz" // Infura api key
    },
    "blockchain": {
        "gasLimit": 100000,
        "network": 3
    },
    "db": {
        "name": "application"
    }
}
```

key.store.js

```JS
require("dotenv").config({path: ".env"});

const HDWalletProvider = require("truffle-hdwallet-provider");
const ethers = require('ethers');
const Web3 = require('web3');

const config = require("./config/app.config");

const mnemonic = process.env.MNEMONIC;
const password = process.env.SECRET;

const endPoint = `${config.infura.endPoint}${config.infura.key}`;

const wallet = ethers.Wallet.fromMnemonic(mnemonic);

const provider = new HDWalletProvider(mnemonic, endPoint);
const web3 = new Web3(provider);

const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
const keystore = web3.eth.accounts.encrypt(account.privateKey, password);

console.log(JSON.stringify(keystore));
```

config/key.store.json From https://www.myetherwallet.com/create-wallet then encrypted using key.store.js

```JSON
{"version":3,"id":"<id>","address":"<address","crypto":{"ciphertext":"<crypto.ciphertext>","cipherparams":{"iv":"<crypto.cipherparams.iv>"},"cipher":"<crypto.cipher>","kdf":"<cryoto.kdf>","kdfparams":{"dklen":"<crypto.kdfparams.dklen>","salt":"<crypto.kdfparams.salt>","n":"<crypto.kdfparams.n>","r":"<crypto.kdfparams.dkler>","p":"<crypto.kdfparams.p>"},"mac":"<crypto.mac>"}}
```

artifacts/App.json From https://github.com/Arsalen/eth-forex-dapp.git

```JSON
{
  "contractName": "<contractname>",
  "abi": ["<abi..>"],
  "metadata": "<metadata>",
  "bytecode": "<bytecode>",
  "sourceMap": "<sourceMap>",
  "deployedSourceMap": "<deployedSourceMap>",
  "source": "<source>",
  "sourcePath": "<sourcePath>",
  "ast": {"<ast>"},
  "legacyAST": {"<legacyAST>"},
  "compiler": {"<compiler>"},
  "networks": {"<networks>"},
  "schemaVersion": "<schemaVersion>",
  "updatedAt": "<updatedAt>",
  "devdoc": {
    "methods": {"<devdoc.methods>"}
  },
  "userdoc": {
    "methods": {"<userdoc.methods>"}
  }
}
```

## Start

In order to be able to accept requests from oracles and forward transactions to the blockchain, install dependencies then run server.

```BASH
npm i --save
npm start

# start server on port: 3000 (default: 3000)

# {"message":"{\"blockHash\":\"0xfc8f19debafd60ba6dbc80986ec9f7450a3743e7b90c4e708dc19e16c9b79d8b\",\"blockNumber\":8448877,\"contractAddress\":null,\"cumulativeGasUsed\":2736541,\"from\":\"0x12e024db6dd4e3a6df2b75394224ed713c2cde38\",\"gasUsed\":24561,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0xca5ace3853cdadfa172d91494d846ee28270a19f\",\"transactionHash\":\"0x1bbb22ce8110360232e30dabc8df7c475eacc0884d428e50bf3357a933b4dc53\",\"transactionIndex\":37}\n","level":"info","date":"2020-08-07T04:34:09.495Z"}

# {"message":"{\"blockHash\":\"0xd3792fae682ec3e0c95eb21c7f8a367e4574297afe369d23eeac3afe8d95bf46\",\"blockNumber\":8448881,\"contractAddress\":null,\"cumulativeGasUsed\":2861780,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":31989,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0xca5ace3853cdadfa172d91494d846ee28270a19f\",\"transactionHash\":\"0x699a1d9a0be0bce19419c1a5121db27e78e49c6a478f245703a564b63d298c8a\",\"transactionIndex\":40}\n","level":"info","date":"2020-08-07T04:34:09.495Z"}

# {"message":"{\"blockHash\":\"0xf8f32004a75aaef3c30c927e1f6d529324e45d3bb11ae11b587b32b921a6d2b9\",\"blockNumber\":8448882,\"contractAddress\":null,\"cumulativeGasUsed\":1512271,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":31989,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0xca5ace3853cdadfa172d91494d846ee28270a19f\",\"transactionHash\":\"0x06323e51875de8f9fc9616612a9232fcb1e43f3fb6278c3b71bf0a952fab1148\",\"transactionIndex\":9}\n","level":"info","date":"2020-08-07T04:34:09.495Z"}

# {"message":"{\"blockHash\":\"0x1daf7abf9a81375b52f8ed535001ac1909cbbf63d3dc34ad9b06a2fb492cea20\",\"blockNumber\":8448884,\"contractAddress\":null,\"cumulativeGasUsed\":2955202,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":31989,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0xca5ace3853cdadfa172d91494d846ee28270a19f\",\"transactionHash\":\"0xf2db82d8954505932cbec1eacb687e204edc3896a3a58f391881dc3ec10d6653\",\"transactionIndex\":15}\n","level":"info","date":"2020-08-07T04:34:09.495Z"}

# {"message":"{\"blockHash\":\"0x51bcabc3e265284df37cbf7714a7e8d51b61adcf29332703f38cc31842413d30\",\"blockNumber\":8448886,\"contractAddress\":null,\"cumulativeGasUsed\":1345814,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":32013,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0xca5ace3853cdadfa172d91494d846ee28270a19f\",\"transactionHash\":\"0x6925785726b26b4ad98a0e6d43ddea510a5dc11c53b209031f06184e00791c05\",\"transactionIndex\":25}\n","level":"info","date":"2020-08-07T04:34:09.495Z"}
```

### Jenkins

You can alternatively setup a jenkins job and make use of the ```Jenkinsfile``` to automate the integration and deployment of the application.
**NOTE:** You have to import configuration files above into the server before you trigger the pipeline.