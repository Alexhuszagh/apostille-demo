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

// VERIFY APOSTILLE

// Verify the transaction hash matches the post hash.
const VerifyTransactionHash = (transaction: nem.TransferTransaction, post: Post) =>
    post.postTransactionHash === transaction.transactionInfo!.hash

// Verify the transaction message matches the hash of the post data.
const VerifyApostilleHash = (transaction: nem.TransferTransaction, post: Post) =>
    CreateApostilleHash(post) === transaction.message.payload

// Get the post date as seconds since the Unix epoch.
const PostDate = (post: Post) =>
    (
        post.lastEditDate === undefined || post.lastEditDate === 0
        ? post.creationDate
        : post.lastEditDate
    )

// Get the transaction deadline date as milliseconds since the epoch.
const TransactionTimestamp = (transaction: nem.TransferTransaction) =>
    transaction.deadline.value
        .atZone(joda.ZoneId.SYSTEM)
        .toInstant()
        .toEpochMilli()

// Get the transaction deadline date as seconds since the Unix epoch.
const TransactionDate = (transaction: nem.TransferTransaction) =>
    Math.floor(TransactionTimestamp(transaction) / 1000)

// Get the config deadline time period in seconds.
const DeadlineDelta = () =>
    joda.Duration.of(config.deadline, config.deadlineUnits).seconds()

// Get the config processing time period in seconds.
const ProcessingDelta = () =>
    joda.Duration.of(config.processing, config.processingUnits).seconds()

// Verify the transaction timestamp to the latest modification data of the post.
const VerifyTimestamp = (transaction: nem.TransferTransaction, post: Post) => {
    const postDate = PostDate(post)!
    const transactionDate = TransactionDate(transaction)!
    // Add one minute just the be lenient, since it may have taken
    // time for the server to process the request.
    const delta = DeadlineDelta() + ProcessingDelta()

    return (
        postDate <= transactionDate
        && postDate + delta >= transactionDate
    )
}

// Extract the recipient address from the transaction.
const ExtractRecipient = (transaction: nem.TransferTransaction) =>
    (<nem.Address> transaction.recipient).plain()

// Verify the transaction recipient address to the owner.
const VerifyRecipient = (transaction: nem.TransferTransaction, post: Post) =>
    AddressFromPrivateKey(post.ownerPrivateKey!) === ExtractRecipient(transaction)

// Verify the apostille transaction to the post data.
export const VerifyApostille = (transaction: nem.TransferTransaction, post: Post) =>
    (
        VerifyTransactionHash(transaction, post)
        && VerifyApostilleHash(transaction, post)
        && VerifyTimestamp(transaction, post)
        && VerifyRecipient(transaction, post)
    )
