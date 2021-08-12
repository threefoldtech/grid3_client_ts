const { getEntity } = require('./entity')
const { getTwin } = require('./twin')

async function signEntityTwinID (self, entityID, twinID) {
  if (isNaN(entityID) || isNaN(twinID)) {
    throw Error('You must pass an ID')
  }

  const twin = await getTwin(self, twinID)
  if (twin.id !== twinID) {
    throw Error(`twin with id ${twinID} does not exist`)
  }

  const entity = await getEntity(self, entityID)
  if (entity.id !== entityID) {
    throw Error(`entity with id ${entityID} does not exist`)
  }

  const arr = new ArrayBuffer(4)
  const view = new DataView(arr)
  view.setUint32(0, entityID, false)

  const arr1 = new ArrayBuffer(4)
  const view1 = new DataView(arr1)
  view1.setUint32(0, twinID, false)

  const tmp = new Uint8Array(arr.byteLength + arr1.byteLength)
  tmp.set(new Uint8Array(arr), 0)
  tmp.set(new Uint8Array(arr1), arr1.byteLength)

  const message = new Uint8Array(tmp)

  const signedMessage = self.key.sign(message)

  return Buffer.from(signedMessage).toString('hex')
}

async function signEntityCreation (self, name, countryID, cityID) {
  if (isNaN(countryID) || isNaN(cityID) || name === '') {
    throw Error('You must pass a valid id or valid name')
  }

  const arr = new ArrayBuffer(4)
  const view = new DataView(arr)
  view.setUint32(0, countryID, false)

  const arr1 = new ArrayBuffer(4)
  const view1 = new DataView(arr1)
  view1.setUint32(0, cityID, false)

  const tmp = new Uint8Array(arr.byteLength + arr1.byteLength)
  tmp.set(new Uint8Array(arr), 0)
  tmp.set(new Uint8Array(arr1), arr1.byteLength)

  const message = new Uint16Array(tmp)

  const utf8Encode = new TextEncoder()
  const nameAsBytes = utf8Encode.encode(name)

  // concat name + countryid + cityid into one uint8array
  const concatArray = new Uint8Array([...nameAsBytes, ...message])

  const signedMessage = self.key.sign(concatArray)

  return Buffer.from(signedMessage).toString('hex')
}

module.exports = {
  signEntityTwinID,
  signEntityCreation
}
