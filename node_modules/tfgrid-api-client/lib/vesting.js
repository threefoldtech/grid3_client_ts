const BN = require('bn.js')
const { toI16F16 } = require('tfgrid-fixed-utils')

async function vestedTransfer (self, locked, perBlock, startingBlock, tftPrice, callback) {
  // parse price to bytes
  tftPrice = toI16F16(tftPrice)

  // convert to price to a little endian byte array of size 4
  const uint8ArrayPrice = Uint8Array.from(tftPrice.toArrayLike(Buffer, 'le', 4))

  locked = new BN(locked)
  locked = await self.api.createType('Balance', locked.mul(new BN(1e12)))

  perBlock = await self.api.createType('Balance', perBlock * 1e12)

  const schedule = {
    locked,
    per_block: perBlock,
    starting_block: startingBlock,
    tft_price: uint8ArrayPrice
  }
  const target = await self.api.createType('LookupSource', self.address)

  const create = await self.api.tx.vesting.vestedTransfer(target, schedule)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return await create.signAndSend(self.key, { nonce }, callback)
}

module.exports = {
  vestedTransfer
}
