import BN from 'bn.js';
import assert from 'assert';

import {assertLength} from './common';

export interface ParserFixPointFn {
  (raw: BN, precision?: number): number;
}

export interface ParserFixPointFactory {
  (upper: number, lower: number): ParserFixPointFn;
}

/// Function to produce function to convert fixed-point to Number
///
/// Fixed interpretation of u<N> place values
/// ... ___ ___ ___ ___ . ___ ___ ___ ___ ...
/// ...  8   4   2   1    1/2 1/4 1/8 1/16...
///
/// Parameters:
/// upper: 0..128 - number of bits in decimal part
/// lower: 0..128 - number of bits in fractional part
///
/// Produced function parameters:
/// raw: substrate_fixed::types::I<upper>F<lower> as I<upper+lower>
/// precision: 0..lower number bits in fractional part to process
export const parserFixPoint: ParserFixPointFactory = function (upper, lower) {
  const len = assertLength(upper, lower);
  return (raw: BN, precision: number = lower): number => {
    assert(raw.bitLength() <= len, 'Bit length is not equal to ' + len);
    const bits: string = raw.toString(2, len);
    const lowerBits: string = (lower > bits.length
      ? bits.padStart(lower, '0')
      : bits).slice(-lower, -1 * (lower - precision) || undefined);
    const floatPart: number = lowerBits
      .split('')
      .reduce((acc, bit, idx) => {
        acc = acc + (bit === '1' ? 1 / 2 ** (idx + 1) : 0);
        return acc;
      }, 0);
    const upperBits: string = bits.slice(0, -lower);
    const decimalPart: number = upperBits ? parseInt(upperBits, 2) : 0;
    return decimalPart + (raw.isNeg() ? -floatPart : floatPart);
  };
}
