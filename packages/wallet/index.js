"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_provider_1 = require("@ethersproject/abstract-provider");
var abstract_signer_1 = require("@ethersproject/abstract-signer");
//import { BigNumber } from "@ethersproject/bignumber";
var bytes_1 = require("@ethersproject/bytes");
var errors = __importStar(require("@ethersproject/errors"));
var hdnode_1 = require("@ethersproject/hdnode");
var properties_1 = require("@ethersproject/properties");
var random_1 = require("@ethersproject/random");
//import { getAddress } from "@ethersproject-aion/address";
var blake2b_1 = require("@ethersproject-aion/blake2b");
var hash_1 = require("@ethersproject-aion/hash");
var signing_key_1 = require("@ethersproject-aion/signing-key");
var transactions_1 = require("@ethersproject-aion/transactions");
var defaultPath = "m/44'/425'/0'/0/0";
function isAccount(value) {
    return (value != null && bytes_1.isHexString(value.privateKey, 64) && value.address != null);
}
var allowedTransactionKeys = [
    "chainId", "data", "gasLimit", "gasPrice", "nonce", "to", "type", "value"
];
var Wallet = /** @class */ (function (_super) {
    __extends(Wallet, _super);
    function Wallet(privateKey, provider) {
        var _newTarget = this.constructor;
        var _this = this;
        errors.checkNew(_newTarget, Wallet);
        _this = _super.call(this) || this;
        if (isAccount(privateKey)) {
            var signingKey_1 = new signing_key_1.SigningKey(privateKey.privateKey);
            properties_1.defineReadOnly(_this, "_signingKey", function () { return signingKey_1; });
            properties_1.defineReadOnly(_this, "address", transactions_1.computeAddress(_this.publicKey));
        }
        else {
            if (properties_1.isNamedInstance(signing_key_1.SigningKey, privateKey)) {
                properties_1.defineReadOnly(_this, "_signingKey", function () { return privateKey; });
            }
            else {
                var signingKey_2 = new signing_key_1.SigningKey(privateKey);
                properties_1.defineReadOnly(_this, "_signingKey", function () { return signingKey_2; });
            }
            properties_1.defineReadOnly(_this, "address", transactions_1.computeAddress(_this.publicKey));
            //defineReadOnly(this, "_mnemonic", (): string => null);
            //defineReadOnly(this, "path", null);
        }
        properties_1.defineReadOnly(_this, "provider", provider || null);
        return _this;
    }
    Object.defineProperty(Wallet.prototype, "privateKey", {
        get: function () { return this._signingKey().privateKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wallet.prototype, "publicKey", {
        get: function () { return this._signingKey().publicKey; },
        enumerable: true,
        configurable: true
    });
    Wallet.prototype._hashTransaction = function (transaction) {
        return blake2b_1.blake2b(transactions_1.serialize(transaction));
    };
    Wallet.prototype._serializeTransaction = function (transaction, signature) {
        return transactions_1.serialize(transaction, signature);
    };
    Wallet.prototype.getAddress = function () {
        return Promise.resolve(this.address);
    };
    Wallet.prototype.connect = function (provider) {
        return new Wallet(this, provider);
    };
    Wallet.prototype.signTransaction = function (transaction) {
        var _this = this;
        return properties_1.resolveProperties(transaction).then(function (tx) {
            var signature = _this._signingKey().signDigest(_this._hashTransaction(tx));
            return _this._serializeTransaction(tx, signature);
        });
    };
    Wallet.prototype.signMessage = function (message) {
        return Promise.resolve(this._signingKey().signDigest(hash_1.hashMessage(message)));
    };
    Wallet.prototype.sendTransaction = function (transaction) {
        var _this = this;
        if (!this.provider) {
            throw new Error("missing provider");
        }
        if (transaction.nonce == null) {
            transaction = properties_1.shallowCopy(transaction);
            transaction.nonce = this.getTransactionCount("pending");
        }
        return Wallet.populateTransaction(transaction, this.provider, this.address).then(function (tx) {
            return _this.signTransaction(tx).then(function (signedTransaction) {
                return _this.provider.sendTransaction(signedTransaction);
            });
        });
    };
    Wallet.prototype.checkTransaction = function (transaction) {
        for (var key in transaction) {
            if (allowedTransactionKeys.indexOf(key) === -1) {
                errors.throwArgumentError("invlaid transaction key: " + key, "transaction", transaction);
            }
        }
        var tx = properties_1.shallowCopy(transaction);
        //if (tx.from == null) { tx.from = this.getAddress(); }
        return tx;
    };
    /**
     *  Static methods to create Wallet instances.
     */
    Wallet.createRandom = function (options) {
        var entropy = random_1.randomBytes(16);
        if (!options) {
            options = {};
        }
        if (options.extraEntropy) {
            entropy = bytes_1.arrayify(bytes_1.hexDataSlice(blake2b_1.blake2b(bytes_1.concat([entropy, options.extraEntropy])), 0, 16));
        }
        var mnemonic = hdnode_1.entropyToMnemonic(entropy, options.locale);
        return Wallet._fromMnemonic(mnemonic, options.path, options.locale);
    };
    Wallet._fromMnemonic = function (mnemonic, path, wordlist) {
        if (!path) {
            path = defaultPath;
        }
        var node = hdnode_1.HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path);
        return new Wallet(signing_key_1.SigningKey.fromSeed(node.privateKey));
    };
    Wallet.populateTransaction = function (transaction, provider, from) {
        if (!properties_1.isNamedInstance(abstract_provider_1.Provider, provider)) {
            errors.throwError("missing provider", errors.INVALID_ARGUMENT, {
                argument: "provider",
                value: provider
            });
        }
        // @TODO
        //      checkProperties(transaction, allowedTransactionKeys);
        var tx = properties_1.shallowCopy(transaction);
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
            var estimate = properties_1.shallowCopy(tx);
            estimate.from = from;
            tx.gasLimit = provider.estimateGas(estimate);
        }
        if (tx.type == null) {
            tx.type = 1;
        }
        if (tx.timestamp == null) {
            tx.timestamp = Math.floor(Date.now() * 1000);
        }
        return properties_1.resolveProperties(tx);
    };
    return Wallet;
}(abstract_signer_1.Signer));
exports.Wallet = Wallet;
