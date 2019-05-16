'use strict';

import fs from 'fs';
import path from 'path';
import zlib from 'browserify-zlib';

import { arrayify, concat, hexlify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

export module TestCase {
    export type ABI = {
        callData: string;
        data: string;
        deployData: string;
        types: Array<string>;
        values: Array<any>;
    };

    export type HDWalletNode = {
        path: string;
        address: string;
        privateKey: string;
    };
}

export function saveTests(tag: string, data: any) {
   //let filename = path.resolve(__dirname, 'testcases', tag + '.json.gz');
   let filename = path.resolve('testcases', tag + '.json.gz');

   fs.writeFileSync(filename, zlib.gzipSync(JSON.stringify(data, undefined, ' ') + '\n'));

   console.log('Save testcase: ' + filename);
}

export function loadTests(tag: string): any {
   let filename = path.resolve(__dirname, 'testcases', tag + '.json.gz');
   return JSON.parse(zlib.gunzipSync(fs.readFileSync(filename)).toString());
}

let seeds: { [ seed: string ]: boolean } = { };

export function randomBytes(seed: string, lower: number, upper?: number): Uint8Array {
    if (seeds[seed]) { throw new Error("duplicate seed: " + seed); }
    seeds[seed] = true;

    if (!upper) { upper = lower; }

    if (upper === 0 && upper === lower) { return new Uint8Array(0); }

    let result = arrayify(keccak256(toUtf8Bytes(seed)));
    while (result.length < upper) {
        result = concat([result, keccak256(result)]);
    }

    let top = arrayify(keccak256(result));
    let percent = ((top[0] << 16) | (top[1] << 8) | top[2]) / 0x01000000;

    return result.slice(0, lower + Math.floor((upper - lower) * percent));
}

export function randomHexString(seed: string, lower: number, upper?: number): string {
    return hexlify(randomBytes(seed, lower, upper));
}

export function randomNumber(seed: string, lower: number, upper: number): number {
    let top = randomBytes(seed, 3);
    let percent = ((top[0] << 16) | (top[1] << 8) | top[2]) / 0x01000000;
    return lower + Math.floor((upper - lower) * percent);
}
