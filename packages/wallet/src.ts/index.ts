"use strict";

import { Provider, TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { ExternallyOwnedAccount, Signer } from "@ethersproject/abstract-signer";
//import { BigNumber } from "@ethersproject/bignumber";
import { arrayify, Bytes, BytesLike, concat, hexDataSlice, isHexString } from "@ethersproject/bytes";
import * as errors from "@ethersproject/errors";
import { HDNode, entropyToMnemonic } from "@ethersproject/hdnode";
import { defineReadOnly, isNamedInstance, resolveProperties, shallowCopy } from "@ethersproject/properties";
import { randomBytes } from "@ethersproject/random";
import { Wordlist } from "@ethersproject/wordlists/wordlist";

//import { getAddress } from "@ethersproject-aion/address";
import { blake2b } from "@ethersproject-aion/blake2b";
import { hashMessage } from "@ethersproject-aion/hash";
import { SigningKey } from "@ethersproject-aion/signing-key";
import { computeAddress, serialize, Transaction } from "@ethersproject-aion/transactions";

const defaultPath = "m/44'/425'/0'/0/0";

function isAccount(value: any): value is ExternallyOwnedAccount {
    return (value != null && isHexString(value.privateKey, 64) && value.address != null);
}

const allowedTransactionKeys: Array<string> = [
    "chainId", "data", "gasLimit", "gasPrice", "nonce", "to", "type", "value"
];

export class Wallet extends Signer implements ExternallyOwnedAccount {

    readonly address: string;
    readonly provider: Provider;

    // Wrapping the _signingKey in a getter function prevents
    // leaking the private key in console.log; still, be careful! :)
    private readonly _signingKey: () => SigningKey;

    constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider) {
        errors.checkNew(new.target, Wallet);

        super();

        if (isAccount(privateKey)) {
            let signingKey = new SigningKey(privateKey.privateKey);
            defineReadOnly(this, "_signingKey", () => signingKey);
            defineReadOnly(this, "address", computeAddress(this.publicKey));

        } else {
            if (isNamedInstance<SigningKey>(SigningKey, privateKey)) {
                defineReadOnly(this, "_signingKey", () => privateKey);
            } else {
                let signingKey = new SigningKey(privateKey);
                defineReadOnly(this, "_signingKey", () => signingKey);
            }
            defineReadOnly(this, "address", computeAddress(this.publicKey));

            //defineReadOnly(this, "_mnemonic", (): string => null);
            //defineReadOnly(this, "path", null);
        }

        defineReadOnly(this, "provider", provider || null);
    }

    get privateKey(): string { return this._signingKey().privateKey; }
    get publicKey(): string { return this._signingKey().publicKey; }

    _hashTransaction(transaction: Transaction): string {
        return blake2b(serialize(transaction));
    }

    _serializeTransaction(transaction: Transaction, signature: string): string {
        return serialize(transaction, signature);
    }

    getAddress(): Promise<string> {
        return Promise.resolve(this.address);
    }

    connect(provider: Provider): Wallet {
        return new Wallet(this, provider);
    }

    signTransaction(transaction: TransactionRequest): Promise<string> {
        return resolveProperties(transaction).then((tx) => {
            let signature = this._signingKey().signDigest(this._hashTransaction(tx));
            return this._serializeTransaction(tx, signature);
        });
    }

    signMessage(message: Bytes | string): Promise<string> {
        return Promise.resolve(this._signingKey().signDigest(hashMessage(message)));
    }

    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
        if (!this.provider) { throw new Error("missing provider"); }

        if (transaction.nonce == null) {
            transaction = shallowCopy(transaction);
            transaction.nonce = this.getTransactionCount("pending");
        }

        return Wallet.populateTransaction(transaction, this.provider, this.address).then((tx) => {
             return this.signTransaction(tx).then((signedTransaction) => {
                 return this.provider.sendTransaction(signedTransaction);
             });
        });
    }

    checkTransaction(transaction: TransactionRequest): TransactionRequest {
        for (let key in transaction) {
            if (allowedTransactionKeys.indexOf(key) === -1) {
                errors.throwArgumentError("invlaid transaction key: " + key, "transaction", transaction);
            }
        }

        let tx = shallowCopy(transaction);
        //if (tx.from == null) { tx.from = this.getAddress(); }
        return tx;
    }

    /**
     *  Static methods to create Wallet instances.
     */
    static createRandom(options?: any): Wallet {
        let entropy: Uint8Array = randomBytes(16);

        if (!options) { options = { }; }

        if (options.extraEntropy) {
            entropy = arrayify(hexDataSlice(blake2b(concat([ entropy, options.extraEntropy ])), 0, 16));
        }

        let mnemonic = entropyToMnemonic(entropy, options.locale);
        return Wallet._fromMnemonic(mnemonic, options.path, options.locale);
    }

    static _fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet {
        if (!path) { path = defaultPath; }
        let node = HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path)
        return new Wallet(SigningKey.fromSeed(node.privateKey));
    }

    static populateTransaction(transaction: any, provider: Provider, from: string | Promise<string>): Promise<Transaction> {

      if (!isNamedInstance<Provider>(Provider, provider)) {
        errors.throwError("missing provider", errors.INVALID_ARGUMENT, {
            argument: "provider",
            value: provider
        });
      }

// @TODO
//      checkProperties(transaction, allowedTransactionKeys);

      let tx = shallowCopy(transaction);

      if (tx.to != null) {
        tx.to = provider.resolveName(tx.to);
      }

      if (tx.gasPrice == null) {
        tx.gasPrice = provider.getGasPrice();
      }

      if (tx.nonce == null) {
        tx.nonce = provider.getTransactionCount(from);
      }

      if (tx.gasLimit == null) {
        let estimate = shallowCopy(tx);
        estimate.from = from;
        tx.gasLimit = provider.estimateGas(estimate);
      }

      if (tx.type == null) {
        tx.type = 1;
      }

      if (tx.timestamp == null) {
        tx.timestamp = Math.floor(Date.now() * 1000);
      }

      return resolveProperties(tx);
    }

}
