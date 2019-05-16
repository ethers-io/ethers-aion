"use strict";

import { Signer, VoidSigner } from "@ethersproject/abstract-signer";
import * as constants from "@ethersproject/constants";
import * as errors from "@ethersproject/errors";
import { BaseProvider } from "@ethersproject/providers";
import * as wordlists from "@ethersproject/wordlists";

import { AvmContract, AvmContractFactory, Contract, ContractFactory } from "@ethersproject-aion/contracts";
import * as providers from "@ethersproject-aion/providers";
import { Wallet } from "@ethersproject-aion/wallet";

import * as utils from "./utils";

////////////////////////
// Helper Functions

function getDefaultProvider(network?: utils.Network | string): BaseProvider {
    if (network == null) { network = "mainnet"; }
    let n = utils.getNetwork(network);
    if (!n || !n._defaultProvider) {
        errors.throwError("unsupported getDefaultProvider network", errors.UNSUPPORTED_OPERATION, {
            operation: "getDefaultProvider",
            network: network
        });
    }
    return n._defaultProvider(providers);
}

export {
    Signer,
    VoidSigner,
    Wallet,

    getDefaultProvider,
    providers,

    AvmContract,
    AvmContractFactory,
    Contract,
    ContractFactory,

    constants,
    errors,

    utils,

    wordlists,
}
