import * as crypto from 'crypto-js'
import * as joda from 'js-joda'
import * as nem from 'nem2-sdk'
import { AccountFromPrivateKey, AddressFromPrivateKey } from './account'
import { config } from './config'
import { ExtractPost } from './models'
import { Post } from 'core/domain/posts'

// CREATE SIGNED APOSTILLE

// Create a 512-bit hash from the UTF8 message data and list of multimedia files.
// This allows us to create a unique hash representation of the post.
const CreateApostilleHash = (post: Post) =>
    crypto.SHA3(ExtractPost(post), {
        outputLength: config.hashLength
    }).toString()

// Create the transfer amount.
const CreateAmount = () =>
    nem.NetworkCurrencyMosaic.createAbsolute(0)

// Create the transfer deadline.
const CreateDeadline = () =>
    nem.Deadline.create(config.deadline, config.deadlineUnits)

// Create the recipient address for the transfer.
const CreateRecipient = (account: nem.Account) =>
    account.address

// Create the mosaics for the transfer.
// Want to transfer a 0-value of the NetworkCurrencyMosaic.
const CreateMosaics = () =>
    [CreateAmount()]

// Create a message for the transaction.
// This is the 512-bit hash of the post data.
const CreateMessage = (post: Post) =>
    nem.PlainMessage.create(CreateApostilleHash(post))

// Create the transfer transaction for the apostille.
const CreateApostille = (account: nem.Account, post: Post) =>
    nem.TransferTransaction.create(
        CreateDeadline(),
        CreateRecipient(account),
        CreateMosaics(),
        CreateMessage(post),
        config.networkType
    )

// Create the signed transfer transaction for the apostille.
export const CreateSignedApostille = (post: Post) => {
    const account = AccountFromPrivateKey(post.ownerPrivateKey!)
    const apostille = CreateApostille(account, post)
    return account.sign(apostille)
}
