const Wallet = require('.').Wallet;

let mnemonic = "old ahead bone easily resemble segment lake bus weekend elevator edge pottery"
console.log("Expected Key:", "b1780f716b0e6f62728194c30e4897ead951a61b9db70d1fa245575e01454e0b8afac31fb6809aa333b6e81bdd0120760863287e6e17521fce2d8864b0043614");
console.log("Expected Address:", "a0d08b16882eda5ea7e97fafa50e7d91275dc9ff2cc4d0672ed8a104c4487ada");
console.log("ACTUAL:", Wallet.fromMnemonic(mnemonic, "m/44'/425'/0'/0'/0'"));

// bdd2a2e29f815a8c7e5bd63c25de1210bd3d17ac4cec5c22fd9d4dd8d397bd55e325a9dc01c8e3e246a46e4a1c6bff0c4d7b5ca343be8a43fa2fdfe5c7f727dd
// a07eed00df4340cd30c9f93f500386d765756ece283f9602ba7aa7662da92c00
