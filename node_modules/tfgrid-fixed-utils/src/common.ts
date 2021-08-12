import assert from 'assert';
import { KeyringPair } from "@polkadot/keyring/types";
import { PubKeyPinPair } from "@encointer/worker-api";
import { Keyring } from "@polkadot/keyring";
import { isPubKeyPinPair } from "@encointer/worker-api/interface";

interface assertLengthFunc {
  (upper: number, lower: number): number
}

export const assertLength: assertLengthFunc = function (upper, lower) {
  const len = upper + lower;
  assert(len >= 8, `Bit length can't be less than 8, provided ${len}`);
  assert(len <= 128, `Bit length can't be bigger than 128, provided ${len}`);
  assert(!(len & (len - 1)), `Bit length should be power of 2, provided ${len}`);
  return len;
};

export const toAccount = (accountOrPubKey: (KeyringPair | PubKeyPinPair), keyring?: Keyring): KeyringPair => {
  if (isPubKeyPinPair(accountOrPubKey)) {
    if (keyring !== undefined) {
      return unlockKeypair(accountOrPubKey as PubKeyPinPair, keyring)
    } else {
      throw  new Error(`Can only use trusted stuff with 'PubKeyPinPair' if a keyring is set.`);
    }
  }

  return accountOrPubKey as KeyringPair
}

export const unlockKeypair = (pair: PubKeyPinPair, keyring: Keyring): KeyringPair => {
  const keyPair = keyring.getPair(pair.pubKey);
  if (!keyPair.isLocked) {
    keyPair.lock();
  }
  keyPair.decodePkcs8(pair.pin);
  return keyPair;
}