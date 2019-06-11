"use strict";

import { Provider, TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BytesLike, hexlify } from "@ethersproject/bytes";
import { defineReadOnly, resolveProperties } from "@ethersproject/properties";
import { ContractFunction } from "@ethersproject/contracts";

import { AvmInterface } from "@ethersproject-aion/abi";
import { UnsignedTransaction } from "@ethersproject-aion/transactions";

type RunFunction = (...params: Array<any>) => Promise<any>;

function prepareTransaction(contract: AvmContract, functionName: string): (...args: Array<any>) => Promise<UnsignedTransaction> {
    let method = contract.interface.getFunction(functionName);
    return (...values: Array<any>) => {
        let tx: UnsignedTransaction = {
            to: contract.address,
            data: contract.interface.encodeFunctionData(method, values)
        };

        return resolveProperties(tx)
    }
}

type RunOptions = {
    callStatic?: boolean;
};

function runMethod(contract: AvmContract, functionName: string, options: RunOptions): RunFunction {
    let method = contract.interface.getFunction(functionName);
    return function(...values): Promise<any> {
        return prepareTransaction(contract, functionName)(...values).then((tx: TransactionRequest) => {

            // AVM code requires this
            if (tx.gasLimit == null) { tx.gasLimit = 2000000; }
            tx.value = 0;

            if (options.callStatic) {
                return (contract.signer || contract.provider).call(tx).then((data) => {
                    return contract.interface.decodeFunctionResult(method, data);
                });
            }

            return contract.signer.sendTransaction(tx);
        });
    }
}

interface Bucket<T> {
    [name: string]: T;
}

export class AvmContract {
    readonly address: string;

    readonly interface: AvmInterface;

    readonly provider: Provider;
    readonly signer: Signer;

    readonly readonly: Bucket<(...args: Array<any>) => any>;
    readonly transaction: Bucket<(...args: Array<any>) => TransactionResponse>;

    //readonly estimate: Bucket<(...params: Array<any>) => Promise<BigNumber>>;
    readonly populateTransaction: Bucket<(...params: Array<any>) => Promise<UnsignedTransaction>>;

    readonly [ name: string ]: ContractFunction | any;

    constructor(address: string, contractInterface: string | AvmInterface, signerOrProvider?: Signer | Provider) {
        defineReadOnly(this, "address", address);

        if (typeof(contractInterface) === "string") {
            contractInterface = AvmInterface.fromString(contractInterface);
        }
        defineReadOnly(this, "interface", contractInterface);

        if (Signer.isSigner(signerOrProvider)) {
            defineReadOnly(this, "signer", signerOrProvider);
            defineReadOnly(this, "provider", signerOrProvider.provider || null);
        } else if (Provider.isProvider(signerOrProvider)) {
            defineReadOnly(this, "signer", null);
            defineReadOnly(this, "provider", signerOrProvider);
        } else {
            defineReadOnly(this, "signer", null);
            defineReadOnly(this, "provider", null);
        }

        defineReadOnly(this, "transaction", { });
        defineReadOnly(this, "readonly", { });
        //defineReadOnly(this, "estimate", { });
        defineReadOnly(this, "populateTransaction", { });

        Object.keys(this.interface.functions).forEach((name) => {
            let func = this.interface.getFunction(name);
            console.log(this.transaction, name, func);
            if (this.transaction[name] == null) {
                defineReadOnly(this.transaction, name, runMethod(this, name, { }));
            }

            if (this.readonly[name] == null) {
                defineReadOnly(this.readonly, name, runMethod(this, name, { callStatic: true }));
            }

            if (this.populateTransaction[name] == null) {
                defineReadOnly(this.populateTransaction, name, prepareTransaction(this, name));
            }
        });
    }

    connect(signerOrProvider: Signer | Provider): AvmContract {
        return new AvmContract(this.address, this.interface, signerOrProvider);
    }
}

export class AvmContractFactory {
    readonly interface: AvmInterface;
    readonly bytecode: string;
    readonly signer: Signer;

    constructor(contractInterface: AvmInterface | string, bytecode: BytesLike, signer?: Signer) {
        if (typeof(contractInterface) === "string") {
            contractInterface = AvmInterface.fromString(contractInterface);
        }

        defineReadOnly(this, "interface", contractInterface);
        defineReadOnly(this, "bytecode", hexlify(bytecode));
        defineReadOnly(this, "signer", signer || null);
    }

    connect(signer?: Signer): AvmContractFactory {
        return new AvmContractFactory(this.interface, this.bytecode, signer);
    }

    attach(address: string): AvmContract {
        return new AvmContract(address, this.interface, this.signer);
    }

    getDeployTransaction(...args: Array<any>): UnsignedTransaction {
        throw new Error("deployment not supported yet; no ABI definition for constructors");
        return null;
    }

    deploy(...args: Array<any>): Promise<AvmContract> {
        this.signer.sendTransaction(this.getDeployTransaction(...args));
        return null;
    }
}
