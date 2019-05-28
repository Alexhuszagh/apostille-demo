import * as nem from 'nem2-sdk'
import { config } from './config'

export const AccountFromPrivateKey = (privateKey: string) =>
    nem.Account.createFromPrivateKey(privateKey, config.networkType)

export const AccountFromPublicKey = (publicKey: string) =>
    nem.PublicAccount.createFromPublicKey(publicKey, config.networkType)

export const GenerateAccount = () =>
    nem.Account.generateNewAccount(config.networkType)

export const GeneratePrivateKey = () =>
    GenerateAccount().privateKey

export const PublicKeyFromPrivateKey = (privateKey: string) =>
    AccountFromPrivateKey(privateKey).publicKey

export const AddressFromPublicKey = (publicKey: string) =>
    AccountFromPublicKey(publicKey).address.plain()

export const AddressFromPrivateKey = (privateKey: string) =>
    AccountFromPrivateKey(privateKey).address.plain()
