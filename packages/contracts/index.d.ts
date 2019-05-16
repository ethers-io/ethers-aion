import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { Contract as _Contract, ContractFactory as _ContractFactory, CallOverrides, Overrides, PayableOverrides, Event, EventFilter, ContractFunction, ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { Interface } from "@ethersproject-aion/abi";
import { AvmContract, AvmContractFactory } from "./avm-contract";
export declare type ContractInterface = string | Interface;
export { CallOverrides, Overrides, PayableOverrides, Event, EventFilter, ContractFunction, ContractReceipt, ContractTransaction, AvmContract, AvmContractFactory };
export declare class Contract extends _Contract {
    static getInterface(contractInterface: ContractInterface): Interface;
}
export declare class ContractFactory extends _ContractFactory {
    static getInterface(contractInterface: ContractInterface): Interface;
    static getContractAddress(tx: {
        from: string;
        nonce: BigNumberish;
    }): string;
    static getContract(address: string, contractInterface: ContractInterface, signer?: Signer): Contract;
}
