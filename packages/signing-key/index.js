"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var nacl = __importStar(require("tweetnacl"));
var bytes_1 = require("@ethersproject/bytes");
var errors = __importStar(require("@ethersproject/errors"));
var properties_1 = require("@ethersproject/properties");
var SigningKey = /** @class */ (function () {
    function SigningKey(privateKey) {
        properties_1.defineReadOnly(this, "curve", "ed25519");
        properties_1.defineReadOnly(this, "privateKey", bytes_1.hexlify(privateKey));
        properties_1.defineReadOnly(this, "publicKey", computePublicKey(this.privateKey));
    }
    SigningKey.prototype.signDigest = function (digest) {
        var signature = nacl.sign.detached(bytes_1.arrayify(digest), bytes_1.arrayify(this.privateKey));
        return bytes_1.hexlify(bytes_1.concat([this.publicKey, signature]));
    };
    SigningKey.prototype.computeSharedSecret = function (otherKey) {
        return errors.throwError("not implemented", errors.NOT_IMPLEMENTED, {});
    };
    SigningKey.fromSeed = function (seed) {
        return new SigningKey(nacl.sign.keyPair.fromSeed(bytes_1.arrayify(seed)).secretKey);
    };
    return SigningKey;
}());
exports.SigningKey = SigningKey;
function recoverPublicKey(digest, signature) {
    var bytes = bytes_1.arrayify(signature);
    var publicKey = bytes.slice(0, 32);
    var sig = bytes.slice(32);
    if (!nacl.sign.detached.verify(bytes_1.arrayify(digest), sig, publicKey)) {
        return null;
    }
    return bytes_1.hexlify(publicKey);
}
exports.recoverPublicKey = recoverPublicKey;
function computePublicKey(key) {
    var bytes = bytes_1.arrayify(key);
    if (bytes.length === 64) {
        return bytes_1.hexlify(nacl.sign.keyPair.fromSecretKey(bytes).publicKey);
    }
    else if (bytes.length === 32) {
        return bytes_1.hexlify(bytes);
    }
    return errors.throwError("invalid public or private key", errors.INVALID_ARGUMENT, {
        argument: "key",
        value: "[REDACTED]"
    });
}
exports.computePublicKey = computePublicKey;
