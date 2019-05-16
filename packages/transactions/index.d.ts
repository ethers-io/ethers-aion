import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
export declare type UnsignedTransaction = {
    to?: string;
    nonce?: number;
    gasLimit?: BigNumberish;
    gasPrice?: BigNumberish;
    data?: BytesLike;
    value?: BigNumberish;
    timestamp?: BigNumberish;
    type?: number;
};
export interface Transaction {
    hash?: string;
    to?: string;
    from?: string;
    nonce: number;
    gasLimit: BigNumber;
    gasPrice: BigNumber;
    data: string;
    value: BigNumber;
    type: number;
    timestamp: BigNumber;
    signature?: string;
}
export declare function computeAddress(key: BytesLike): string;
export declare function recoverAddress(digest: BytesLike, signature: BytesLike): string;
export declare function serialize(transaction: UnsignedTransaction, signature?: BytesLike): string;
export declare function parse(rawTransaction: BytesLike): Transaction;
