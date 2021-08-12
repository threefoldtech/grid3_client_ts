import assert from 'assert';
import BN from 'bn.js';

import { assertLength } from './common';

export interface ToFixPointFn {
  (num: number): BN;
}

export interface ToFixPointFactory {
  (upper: number, lower: number): ToFixPointFn
}

export const toFixPoint: ToFixPointFactory = function (upper, lower) {
  assertLength(upper, lower);
  return (num: number): BN => {
    const [upperBits, lowerBits] = num.toString(2).split('.');
    assert(upperBits.length <= upper, 'Number is larger than maximum in '.concat(upper.toString(), 'bit'));
    if (lowerBits !== undefined) {
      const bits = upperBits.concat(lowerBits.length > lower ? lowerBits.substr(0, lower) : lowerBits.padEnd(lower, '0'));
      return new BN(bits, 2);
    } else {
      const bits = upperBits.padStart(upper, '0').padEnd(upper + lower, '0');
      return new BN(bits, 2);
    }
  };
};
