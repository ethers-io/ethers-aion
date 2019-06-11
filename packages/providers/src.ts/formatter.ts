"use strict";

import { Formatter as _Formatter } from "@ethersproject/providers/formatter";

import { getAddress } from "@ethersproject-aion/address";
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

export function getDefaultFormatter(): Formatter {
    if (defaultFormatter == null) {
        defaultFormatter = new Formatter();
    }
    return defaultFormatter;
}
