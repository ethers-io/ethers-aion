export declare module TestCase {
    type ABI = {
        callData: string;
        data: string;
        deployData: string;
        types: Array<string>;
        values: Array<any>;
    };
    type HDWalletNode = {
        path: string;
        address: string;
        privateKey: string;
    };
}
export declare function saveTests(tag: string, data: any): void;
export declare function loadTests(tag: string): any;
export declare function randomBytes(seed: string, lower: number, upper?: number): Uint8Array;
export declare function randomHexString(seed: string, lower: number, upper?: number): string;
export declare function randomNumber(seed: string, lower: number, upper: number): number;
