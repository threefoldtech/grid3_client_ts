'use strict';

import {parseI16F16, parseI32F32} from '.';

import BN from 'bn.js';

describe('parserFixPoint', () => {
  it('should parse 0x0', () => {
    const result = parseI16F16(new BN(0x0));
    expect(result).toEqual(0);
  });
  it('should parse 1', () => {
    const result = parseI16F16(new BN(0x10000));
    expect(result).toEqual(1);
  });
  it('should parse 1', () => {
    const result = parseI32F32(new BN(0x128b260000), 18);
    expect(result).toEqual(18.543548583984375);
  });
});
