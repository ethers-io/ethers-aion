"use strict";

import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { isNamedInstance } from "@ethersproject/properties";

import {
    Contract as _Contract,
    ContractFactory as _ContractFactory,

    CallOverrides,
    Overrides,
    PayableOverrides,

    Event,
    EventFilter,
    ContractFunction,

    ContractReceipt,
    ContractTransaction
} from "@ethersproject/contracts";

import { getContractAddress } from "@ethersproject-aion/address";
import { Interface } from "@ethersproject-aion/abi";

import { AvmContract, AvmContractFactory } from "./avm-contract";

export type ContractInterface = string | Interface

export {
    CallOverrides,
    Overrides,
    PayableOverrides,

    Event,
    EventFilter,
    ContractFunction,

    ContractReceipt,
    ContractTransaction,

    AvmContract,
    AvmContractFactory
}

export class Contract extends _Contract {
    static getInterface(contractInterface: ContractInterface): Interface {
        if (isNamedInstance<Interface>(Interface, contractInterface)) {
            return contractInterface;
        }
        return new Interface(contractInterface);
    }
}

export class ContractFactory extends _ContractFactory {
    static getInterface(contractInterface: ContractInterface): Interface {
        return Contract.getInterface(contractInterface);
    }

    static getContractAddress(tx: { from: string, nonce: BigNumberish }): string {
        return getContractAddress(tx);
    }

    static getContract(address: string, contractInterface: ContractInterface, signer?: Signer): Contract {
        return new Contract(address, contractInterface, signer);
    }

}
