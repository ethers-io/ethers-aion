import { BigNumberish } from "@ethersproject/bignumber";
export declare function getAddress(address: string): string;
export declare function getContractAddress(transaction: {
    from: string;
    nonce: BigNumberish;
}): string;
