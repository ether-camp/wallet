# Multisignature Wallet on Ethereum [![Build Status](https://travis-ci.org/ether-camp/wallet.svg?branch=master)](https://travis-ci.org/ether-camp/wallet)

That's a sample application to demonstrate working with Ethereum from js using web3.js and ethereumjs.

```
$ git clone https://github.com/ether-camp/wallet
```

The app gets JSON RPC url from the environment variable `WALLET_JSON_RPC` and NameReg address from `WALLET_NAME_REG`.

Building:
```
$ npm install bower -g
$ npm install
$ gulp
```

Running:
```
$ node app/app.js
```
