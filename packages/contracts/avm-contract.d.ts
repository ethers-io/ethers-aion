import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BytesLike } from "@ethersproject/bytes";
import { ContractFunction } from "@ethersproject/contracts";
import { AvmInterface } from "@ethersproject-aion/abi";
import { UnsignedTransaction } from "@ethersproject-aion/transactions";
interface Bucket<T> {
    [name: string]: T;
}
export declare class AvmContract {
    readonly address: string;
    readonly interface: AvmInterface;
    readonly provider: Provider;
    readonly signer: Signer;
    readonly readonly: Bucket<(...args: Array<any>) => any>;
    readonly transaction: Bucket<(...args: Array<any>) => TransactionResponse>;
    readonly populateTransaction: Bucket<(...params: Array<any>) => Promise<UnsignedTransaction>>;
    readonly [name: string]: ContractFunction | any;
    constructor(address: string, contractInterface: string | AvmInterface, signerOrProvider?: Signer | Provider);
    connect(signerOrProvider: Signer | Provider): AvmContract;
}
export declare class AvmContractFactory {
    readonly interface: AvmInterface;
    readonly bytecode: string;
    readonly signer: Signer;
    constructor(contractInterface: AvmInterface | string, bytecode: BytesLike, signer?: Signer);
    connect(signer?: Signer): AvmContractFactory;
    attach(address: string): AvmContract;
    getDeployTransaction(...args: Array<any>): UnsignedTransaction;
    deploy(...args: Array<any>): Promise<AvmContract>;
}
export {};
