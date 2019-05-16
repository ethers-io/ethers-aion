"use strict";

import * as base64 from "@ethersproject/base64";
import { BigNumber } from "@ethersproject/bignumber";
import { arrayify, concat, hexDataSlice, hexDataLength, hexlify, hexStripZeros, hexValue, hexZeroPad, isHexString, stripZeros, zeroPad } from "@ethersproject/bytes";
import { hashMessage, id } from "@ethersproject/hash";
import * as HDNode from "@ethersproject/hdnode";
import { keccak256 } from "@ethersproject/keccak256";
import { sha256 } from "@ethersproject/sha2";
import { keccak256 as solidityKeccak256, pack as solidityPack, sha256 as soliditySha256 } from "@ethersproject/solidity";
import { randomBytes } from "@ethersproject/random";
import { checkProperties, deepCopy, defineReadOnly, resolveProperties, shallowCopy } from "@ethersproject/properties";
import * as RLP from "@ethersproject/rlp";
import { formatBytes32String, parseBytes32String, toUtf8Bytes, toUtf8String } from "@ethersproject/strings";
import { commify, formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { fetchJson } from "@ethersproject/web";

import { AbiCoder, AvmCoder, AvmInterface, defaultAbiCoder, defaultAvmCoder, Interface } from "@ethersproject-aion/abi";
import { getAddress, getContractAddress } from "@ethersproject-aion/address";
import { blake2b } from "@ethersproject-aion/blake2b";
import { getNetwork } from "@ethersproject-aion/networks";
import { SigningKey } from "@ethersproject-aion/signing-key";
import { parse as parseTransaction, serialize as serializeTransaction } from "@ethersproject-aion/transactions";


////////////////////////
// Enums

import { SupportedAlgorithms } from "@ethersproject/sha2";
import { UnicodeNormalizationForm } from "@ethersproject/strings";


////////////////////////
// Types

import { CoerceFunc, EventFragment, FunctionFragment, ParamType } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { Bytes, BytesLike, Hexable } from "@ethersproject/bytes";
import { Network, Networkish } from "@ethersproject/networks";
import { ConnectionInfo, OnceBlockable, PollOptions } from "@ethersproject/web";
import { Wordlist } from "@ethersproject/wordlists/wordlist";

import { Transaction, UnsignedTransaction } from "@ethersproject-aion/transactions";

////////////////////////
// Exports

export {
    AbiCoder,
    defaultAbiCoder,

    Interface,

    AvmCoder,
    AvmInterface,
    defaultAvmCoder,

    RLP,

    fetchJson,
    getNetwork,

    checkProperties,
    deepCopy,
    defineReadOnly,
    resolveProperties,
    shallowCopy,

    arrayify,

    concat,
    stripZeros,
    zeroPad,

    HDNode,
    SigningKey,

    base64,

    BigNumber,

    hexlify,
    isHexString,
    hexStripZeros,
    hexValue,
    hexZeroPad,
    hexDataLength,
    hexDataSlice,

    toUtf8Bytes,
    toUtf8String,

    formatBytes32String,
    parseBytes32String,

    hashMessage,
    id,

    getAddress,
    getContractAddress,

    formatEther,
    parseEther,

    formatUnits,
    parseUnits,

    commify,

    blake2b,
    keccak256,
    sha256,

    randomBytes,

    solidityPack,
    solidityKeccak256,
    soliditySha256,

    parseTransaction,
    serializeTransaction,

    //computeAddress,
    //computePublicKey,
    //recoverAddress,
    //recoverPublicKey,
    //verifyMessage,


    ////////////////////////
    // Enums

    SupportedAlgorithms,
    UnicodeNormalizationForm,


    ////////////////////////
    // Types

    CoerceFunc,
    EventFragment,
    FunctionFragment,
    ParamType,

    BigNumberish,

    Bytes,
    BytesLike,
    Hexable,

    Network,
    Networkish,

    Transaction,
    UnsignedTransaction,

    ConnectionInfo,
    OnceBlockable,
    PollOptions,

    Wordlist
}
