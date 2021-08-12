const { hex2a } = require('./util')

// createFarm creates a farm with given properties
async function createFarm (self, name, pricingPolicyID, certificationType, countryID, cityID, publicIPs, callback) {
  try {
    await validateFarm(self, name)
  } catch (error) {
    // callback early with error
    if (callback) {
      return callback(error)
    }
    return error
  }

  const create = self.api.tx.tfgridModule.createFarm(name, pricingPolicyID, certificationType, countryID, cityID, publicIPs)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

// getFarm gets a farm by id
async function getFarm (self, id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const farm = await self.api.query.tfgridModule.farms(id)

  const res = farm.toJSON()
  if (res.id !== id) {
    throw Error('No such farm')
  }

  res.name = hex2a(res.name)

  if (res.public_ips.length > 0) {
    res.public_ips = res.public_ips.map(ip => {
      return {
        ip: hex2a(ip.ip),
        gateway: hex2a(ip.gateway),
        contract_id: ip.contract_id
      }
    })
  }
  return res
}

async function listFarms (self) {
  const farms = await self.api.query.tfgridModule.farms.entries()

  const parsedFarms = farms.map(farm => {
    const parsedFarm = farm[1].toJSON()
    parsedFarm.name = hex2a(parsedFarm.name)

    return parsedFarm
  })

  return parsedFarms
}

// deleteFarm deletes a farm by id
async function deleteFarm (self, id, callback) {
  const farm = await getFarm(self, id)
  if (parseInt(farm.id) !== parseInt(id)) {
    throw Error(`farm with id ${id} does not exist`)
  }
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return self.api.tx.tfgridModule
    .deleteFarm(id)
    .signAndSend(self.key, { nonce }, callback)
}

async function validateFarm (self, name) {
  if (name === '') {
    throw Error('farm should have a name')
  }
}

module.exports = {
  createFarm,
  getFarm,
  deleteFarm,
  listFarms
}
