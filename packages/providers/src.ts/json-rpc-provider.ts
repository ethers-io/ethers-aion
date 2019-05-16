"use strict";

import { Formatter as _Formatter } from "@ethersproject/providers/formatter";
import { JsonRpcProvider as _JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers/json-rpc-provider";
import { ConnectionInfo } from "@ethersproject/web";

import { getAddress } from "@ethersproject-aion/address";
import { Networkish } from "@ethersproject-aion/networks";
import { parse as parseTransaction } from "@ethersproject-aion/transactions";

export class Formatter extends _Formatter {
    address(value: any): string {
        return getAddress(value);
    }

    transaction(value: any): any {
        return parseTransaction(value);
    }
}

let defaultFormatter: Formatter = null;

export {
    JsonRpcSigner,

    ConnectionInfo,
    Networkish
};

export class JsonRpcProvider extends _JsonRpcProvider {
    static getFormatter(): Formatter {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    }
}
