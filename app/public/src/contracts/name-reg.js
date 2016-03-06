var abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "name",
        "type": "bytes32"
      }
    ],
    "name": "addressOf",
    "outputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "type": "function"
  }
];

module.exports.create = function(web3, address) {
    return web3.eth.contract(abi).at(address);
};