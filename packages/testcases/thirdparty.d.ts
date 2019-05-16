
declare module "aion-web3" {
    class Web3 {
        constructor(provider: any);

        eth: {
            accounts: {
                wallet: {
                    _accounts: {
                        privateKeyToAccount(privateKey: string): any
                        create(privateKey: string): any
                    }
                }
            }
        };

        static utils: {
            toChecksumAddress(privateKey: string): string;
        }
    }

    export default Web3;
}

declare module "browserify-zlib" {
    export interface ZlibOptions {
        flush?: number;
        finishFlush?: number;
        chunkSize?: number;
        windowBits?: number;
        level?: number;
        memLevel?: number;
        strategy?: number;
        dictionary?: any;
    }

    type InputType = string | Buffer | DataView | ArrayBuffer;

    export function gzipSync(buf: InputType, options?: ZlibOptions): Buffer;
    export function gunzipSync(buf: InputType, options?: ZlibOptions): Buffer;
}

