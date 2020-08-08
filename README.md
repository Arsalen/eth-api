# eth-api

Second out of three components of the ethereum-oracle-api-dapp project:
  - [ethereum oracle](https://github.com/Arsalen/eth-oracle)
  - ethereum API server
  - [ethereum sample dapp](https://github.com/Arsalen/eth-forex-dapp) (An instance is already deployed [here](https://ropsten.etherscan.io/address/0x7Fe0c23379aBd49eE51D33163bdE00AacF70f443))

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

On a [ubuntu server](https://releases.ubuntu.com/18.04/), install [PM2](https://pm2.keymetrics.io/) to launch the API as a daemon service, [RabbitMQ](https://www.rabbitmq.com/) to store messages in their respective queues.
On [Infura](https://infura.io/), setup a new project to connect to ropsten.
On [MEW](https://www.myetherwallet.com/), generate a wallet through a mnemonic phrase, download keystore file and fund the address with some [fake ether](https://faucet.ropsten.be/).

***PS:*** You can make use of [this role](https://galaxy.ansible.com/arsalen/rabbitmq) to install RabbitMQ.

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
# {"message":"{\"blockHash\":\"0x42a3a0b8692fe8b0a6f1a66a790310cfc577f4647d64a032f2c902ef8ebcace6\",\"blockNumber\":8454615,\"contractAddress\":null,\"cumulativeGasUsed\":185318,\"from\":\"0x12e024db6dd4e3a6df2b75394224ed713c2cde38\",\"gasUsed\":45366,\"logs\":[{\"address\":\"0x7Fe0c23379aBd49eE51D33163bdE00AacF70f443\",\"blockHash\":\"0x42a3a0b8692fe8b0a6f1a66a790310cfc577f4647d64a032f2c902ef8ebcace6\",\"blockNumber\":8454615,\"data\":\"0x000000000000000000000000b56546ac90615b099375fe5af302a7dcfd56035b0000000000000000000000000000000000000000000000000000000000000001\",\"logIndex\":0,\"removed\":false,\"topics\":[\"0x71b03471b324bbcc7546b2626d0407dbb70a61e5e77c56214352d9c12893933f\"],\"transactionHash\":\"0xb09690d87ff9e178c625d7a6ee57a1ec8d3d5325554e5e60923cee11d26130e6\",\"transactionIndex\":3,\"id\":\"log_b6a9f371\"}],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000200000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x7fe0c23379abd49ee51d33163bde00aacf70f443\",\"transactionHash\":\"0xb09690d87ff9e178c625d7a6ee57a1ec8d3d5325554e5e60923cee11d26130e6\",\"transactionIndex\":3}\n","level":"info","date":"2020-08-08T00:36:44.432Z"}
# {"message":"{\"blockHash\":\"0xb5c46f27474cf85fdaa69e66549e9a0aaaf9ecb5f98657f29d3ed9a1555e5245\",\"blockNumber\":8454640,\"contractAddress\":null,\"cumulativeGasUsed\":664985,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":72713,\"logs\":[{\"address\":\"0x7Fe0c23379aBd49eE51D33163bdE00AacF70f443\",\"blockHash\":\"0xb5c46f27474cf85fdaa69e66549e9a0aaaf9ecb5f98657f29d3ed9a1555e5245\",\"blockNumber\":8454640,\"data\":\"0x12bf4d9103851273a25679e59cb3784a61391587db28b43bff2e6be6b4e11d530000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000008302e383435393335000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a3135393637393630383500000000000000000000000000000000000000000000\",\"logIndex\":4,\"removed\":false,\"topics\":[\"0x9a5587419bbe176e8391f06898d25f241100a906a603045f3d7484c9359e6d72\"],\"transactionHash\":\"0x1774b3f2a973c668a017de7401e7800f95ff2854911b3f1f10520a27062d861b\",\"transactionIndex\":11,\"id\":\"log_367eacf8\"}],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000080000000000800000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x7fe0c23379abd49ee51d33163bde00aacf70f443\",\"transactionHash\":\"0x1774b3f2a973c668a017de7401e7800f95ff2854911b3f1f10520a27062d861b\",\"transactionIndex\":11}\n","level":"info","date":"2020-08-08T00:36:44.432Z"}
# {"message":"{\"blockHash\":\"0x210bc5bcb344b6ca4c77d31076956d29e5ffa72f08a1b89d3380c775b73068e7\",\"blockNumber\":8454641,\"contractAddress\":null,\"cumulativeGasUsed\":1401113,\"from\":\"0xb56546ac90615b099375fe5af302a7dcfd56035b\",\"gasUsed\":72713,\"logs\":[{\"address\":\"0x7Fe0c23379aBd49eE51D33163bdE00AacF70f443\",\"blockHash\":\"0x210bc5bcb344b6ca4c77d31076956d29e5ffa72f08a1b89d3380c775b73068e7\",\"blockNumber\":8454641,\"data\":\"0x77851416942e025dac277381e7affc61e6ff6ce8b49081d4dda0821e93b456310000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000008322e373132393932000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a3135393637393630383500000000000000000000000000000000000000000000\",\"logIndex\":0,\"removed\":false,\"topics\":[\"0x9a5587419bbe176e8391f06898d25f241100a906a603045f3d7484c9359e6d72\"],\"transactionHash\":\"0xed37f25c02af2729f36011705cda3e50ca7daae1398413271d7601d08a5cfa7b\",\"transactionIndex\":3,\"id\":\"log_59ce6d34\"}],\"logsBloom\":\"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000080000000000800000000000000000000000000000000000000000000000000000000000000000\",\"status\":true,\"to\":\"0x7fe0c23379abd49ee51d33163bde00aacf70f443\",\"transactionHash\":\"0xed37f25c02af2729f36011705cda3e50ca7daae1398413271d7601d08a5cfa7b\",\"transactionIndex\":3}\n","level":"info","date":"2020-08-08T00:36:44.432Z"}
```

### Jenkins

You can alternatively setup a jenkins job and make use of the ```Jenkinsfile``` to automate the integration and deployment of the application.
**NOTE:** You have to import configuration files above into the server before you trigger the pipeline.
