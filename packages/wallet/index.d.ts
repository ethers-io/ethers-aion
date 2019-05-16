import { Provider, TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { ExternallyOwnedAccount, Signer } from "@ethersproject/abstract-signer";
import { Bytes, BytesLike } from "@ethersproject/bytes";
import { Wordlist } from "@ethersproject/wordlists/wordlist";
import { SigningKey } from "@ethersproject-aion/signing-key";
import { Transaction } from "@ethersproject-aion/transactions";
export declare class Wallet extends Signer implements ExternallyOwnedAccount {
    readonly address: string;
    readonly provider: Provider;
    private readonly _signingKey;
    constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider);
    readonly privateKey: string;
    readonly publicKey: string;
    _hashTransaction(transaction: Transaction): string;
    _serializeTransaction(transaction: Transaction, signature: string): string;
    getAddress(): Promise<string>;
    connect(provider: Provider): Wallet;
    signTransaction(transaction: TransactionRequest): Promise<string>;
    signMessage(message: Bytes | string): Promise<string>;
    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
    checkTransaction(transaction: TransactionRequest): TransactionRequest;
    /**
     *  Static methods to create Wallet instances.
     */
    static createRandom(options?: any): Wallet;
    static _fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet;
    static populateTransaction(transaction: any, provider: Provider, from: string | Promise<string>): Promise<Transaction>;
}
