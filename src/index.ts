#!/usr/bin/env ts-node-script

import { parse } from 'ts-command-line-args';

interface IWhatsABIArguments {
    help?: boolean;
}

export const args = parse<IWhatsABIArguments>(
    {
        help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
    },
);
