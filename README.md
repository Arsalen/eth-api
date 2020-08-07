# eth-api

Second out of three components of the ethereum-oracle-api-dapp project:
  - [ethereum oracle](https://github.com/Arsalen/eth-oracle)
  - ethereum API server
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

``` .env ```

```INI
PORT=3000 # Server port

MNEMONIC="one two three four five six seven eight nine ten eleven twelve" # Mnemonic passphrase

SECRET="a1B2c3D4e5F6g7H"  # Secret to decrypt keystore
```

``` app.process.js ```

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

``` config/app.config.json ```

```JSON
{
    "broker": {
        "endPoint": "amqp://<ip>",
        "exchange": "application",
        "type": "direct"
    },
    "infura": {
        "endPoint": "https://ropsten.infura.io/v3/",
        "key": "abcd1efgh2ijkl3mnop4qrst5uvwx6yz"
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

``` key.store.js ```

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

``` config/key.store.json ``` From https://www.myetherwallet.com/create-wallet then encrypted using key.store.js

```JSON
{"version":3,"id":"<id>","address":"<address","crypto":{"ciphertext":"<crypto.ciphertext>","cipherparams":{"iv":"<crypto.cipherparams.iv>"},"cipher":"<crypto.cipher>","kdf":"<cryoto.kdf>","kdfparams":{"dklen":"<crypto.kdfparams.dklen>","salt":"<crypto.kdfparams.salt>","n":"<crypto.kdfparams.n>","r":"<crypto.kdfparams.dkler>","p":"<crypto.kdfparams.p>"},"mac":"<crypto.mac>"}}
```

``` artifacts/App.json ``` From https://github.com/Arsalen/eth-forex-dapp.git

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
pm2 start app.process.js

pm2 logs eth-api

# start server on port: 3000 (default: 3000)

# {"message":"{\"blockHash\":\"0x87c2171ed0f804e020ff30d0ba43f315817be7c517327c351b542ba06a563126\",\"blockNumber\":8450324,\"contractAddress\":null,\"cumulativeGasUsed\":818395,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":25640,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x58309ef38ea0903adbcfb9d0ac0123e35160df5b\",\"transactionHash\":\"0x94b2ff056fda6bfd3c0c7a79b4114e903555ccb41a928f283977789555c86279\",\"transactionIndex\":17}\n","level":"info","date":"2020-08-07T10:24:54.143Z"}

# {"message":"{\"blockHash\":\"0xc3b01c85b1997c34ed14d45fcdb6de5095920e651d761692d517a0c2e924098c\",\"blockNumber\":8450326,\"contractAddress\":null,\"cumulativeGasUsed\":1089151,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":25640,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x58309ef38ea0903adbcfb9d0ac0123e35160df5b\",\"transactionHash\":\"0x39d3e25338aac331ca7bc549b1c11ed9cad5264b5274b06da16fca57ac19c76f\",\"transactionIndex\":7}\n","level":"info","date":"2020-08-07T10:24:54.143Z"}

# {"message":"{\"blockHash\":\"0x74aea44f984df433fbbd721a10251dc73f66e36fc3e2408024868ae2f908cd5f\",\"blockNumber\":8450327,\"contractAddress\":null,\"cumulativeGasUsed\":656978,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":25640,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x58309ef38ea0903adbcfb9d0ac0123e35160df5b\",\"transactionHash\":\"0x871e2809c9a409b7f5ab2b1cf71bf4f04212565503a6da465b6cb4db06687f49\",\"transactionIndex\":11}\n","level":"info","date":"2020-08-07T10:24:54.143Z"}

# {"message":"{\"blockHash\":\"0xbe0227b4953e66a2f4f0c7b2373b55c5dbff52f8ceca2c1839b894ec1e04b41b\",\"blockNumber\":8450328,\"contractAddress\":null,\"cumulativeGasUsed\":3832943,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":25640,\"logs\":[],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x58309ef38ea0903adbcfb9d0ac0123e35160df5b\",\"transactionHash\":\"0x649eea0a891de94f7b5f5c60c1f6a6fe0e0eadec14d84c75c1f6373702f5c4d5\",\"transactionIndex\":6}\n","level":"info","date":"2020-08-07T10:24:54.143Z"}
```

### Jenkins

You can alternatively setup a jenkins job and make use of the ```Jenkinsfile``` to automate the integration and deployment of the application.
**NOTE:** You have to import configuration files above into the server before you trigger the pipeline.
