'use strict';

import { toI16F16, toI32F32 } from '.';

import BN from 'bn.js';

describe('toFixPoint', () => {
  it('should parse integer to fixPoint', async () => {
    const result = toI16F16(1);
    expect(result).toEqual(new BN(0x10000, 2));
  });
  it('should parse 0 to fixPoint', async () => {
    const result = toI16F16(0);
    expect(result).toEqual(new BN(0x0, 2));
  });
  it('should parse 1.1 to fixPoint', async () => {
    const result = toI16F16(1.1);
    expect(result).toEqual(new BN(0x011999));
  });
  it('should parse location to fixPoint', async () => {
    const location = { lat: 35.48415638, lon: 18.543548584 };
    const resultLat = toI32F32(location.lat);
    expect(resultLat).toEqual(new BN(0x237bf1ac2a));
    const resultLon = toI32F32(location.lon);
    expect(resultLon).toEqual(new BN(0x128b260000));
  });
});
