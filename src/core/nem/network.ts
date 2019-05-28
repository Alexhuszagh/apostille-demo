import * as nem from 'nem2-sdk'
import { config } from './config'

const TransactionHttp = () =>
    new nem.TransactionHttp(config.url)

// Post the transaction to the NEM node.
export const PostTransaction = (signedTransaction: nem.SignedTransaction) =>
    TransactionHttp()
        .announce(signedTransaction)
        .toPromise()

// Get the transaction from the transaction hash.
export const GetTransactionByHash = (hash: string) =>
    TransactionHttp()
        .getTransaction(hash)
        .toPromise()

// Get the transaction status from the transaction hash.
export const GetTransactionStatusByHash = (hash: string) =>
    TransactionHttp()
        .getTransactionStatus(hash)
        .toPromise()
