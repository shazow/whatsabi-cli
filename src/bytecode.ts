#!/usr/bin/env ts-node-script

import { readFileSync } from "fs";

import { bytecodeToString, bytecodeToStringConfig } from './internal/debug';

interface IProvider {
    getCode(address: string): Promise<string>;
}

interface IWithCache {
    (key: string, getter: () => Promise<any>): Promise<any>;
}

export async function PrintBytecode(address: string, config: {
    provider: IProvider,
    withCache: IWithCache,
    opcodeLookup?: Map<number, string>,

    jumpdest?: number,
    limit?: number,
}) {
    const { provider, withCache, opcodeLookup, jumpdest, limit } = config;

    let code : string;
    if (!address) {
        console.error("Invalid address: " + address);
        process.exit(1);
    } else if (address === "-") {
        // Read contract code from stdin
        code = readFileSync(0, 'utf8').trim();
    } else {
        console.debug("Loading code for address:", address);
        code = await withCache(
            `${address}_abi`,
            async () => {
                return await provider.getCode(address)
            },
        );
    }

    const options : bytecodeToStringConfig = {};
    if (opcodeLookup) {
        options.opcodeLookup = opcodeLookup;
    }

    if (jumpdest) {
        options.startPos = options.highlightPos = jumpdest;
        options.stopPos = jumpdest + (limit || 50);
    }

    const iter = bytecodeToString(code, options);
    while (true) {
        const {value, done} = iter.next()
        if (done) break;
        console.log(value);
    }
}
