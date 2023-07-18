#!/usr/bin/env ts-node-script

import { ethers } from "ethers";

import { PrintBytecode } from './bytecode';
import { noCache } from './internal/cache';

import { cac } from 'cac';

const { INFURA_API_KEY, ETHERSCAN_API_KEY } = process.env;
const provider = INFURA_API_KEY ? (new ethers.providers.InfuraProvider("homestead", INFURA_API_KEY)) : ethers.getDefaultProvider();

const cli = cac();

cli
    .command('bytecode <address>[:<offset>]', 'Print bytecode of an address')
    .option('--limit', 'Number of instructions to print')
    .option('--jumpdest', 'Which instruction to start from')
    .action((address, options) => {
        const jumpdest = options.jumpdest.startsWith("0x") ? parseInt(options.jumpdest, 16) : parseInt(options.jumpdest);
        const limit = options.limit ? parseInt(options.limit) : undefined;
        PrintBytecode(address, {
            provider,
            jumpdest, limit,
            withCache: noCache,
        })
    })

cli.help()

cli.parse()
