import * as nem from 'nem2-sdk'
import { config } from './config'

const TransactionHttp = () =>
    new nem.TransactionHttp(config.url)

// Post the transaction to the NEM node.
export const PostTransaction = (signedTransaction: nem.SignedTransaction) =>
    TransactionHttp()
        .announce(signedTransaction)
        .toPromise()
