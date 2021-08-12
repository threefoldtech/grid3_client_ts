import assert from 'assert';
import BN from 'bn.js';
import { bnToU8a } from '@polkadot/util';

import {assertLength} from './common';

export interface EncodeFloatToFixPointFn {
  (num: number): Uint8Array;
}

export interface EncodeFloatToFixPointFactory {
  (upper: number, lower: number): EncodeFloatToFixPointFn;
}

export const encodeFloatToFixPoint: EncodeFloatToFixPointFactory = function (upper, lower) {
  assertLength(upper, lower);
  return (num: number): Uint8Array => {
    const [upperBits, lowerBits] = num.toString(2).split('.');
    assert(upperBits.length <= upper, 'Number is larger than maximum in '.concat(upper.toString(), 'bit'));
    if (lowerBits !== undefined) {
      const lowerPadded = lowerBits.length > lower ? lowerBits.substr(0, lower) : lowerBits.padEnd(lower, '0');
      const upperPadded = upperBits.padStart(upper, '0');
      const upperBN = bnToU8a(new BN(upperPadded, 2), upper, true);
      const lowerBN = bnToU8a(new BN(lowerPadded, 2), lower, true);
      return Uint8Array.from([...lowerBN, ...upperBN]);
    } else {
      const bits = upperBits.padStart(upper, '0').padEnd(lower + upper, '0');
      return bnToU8a(new BN(bits, 2), lower + upper, true);
    }
  };
}
