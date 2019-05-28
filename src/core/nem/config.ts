import * as joda from 'js-joda'
import * as nem from 'nem2-sdk'

// Configuration
export const config = {
    // The number of bits in the resulting hash.
    hashLength: 512,
    // The value of the duration from the current time for the transaction deadline.
    deadline: 10,
    // The units of the duration from the current time for the transaction deadline.
    deadlineUnits: joda.ChronoUnit.MINUTES,
    // NEM network type.
    networkType: nem.NetworkType.MIJIN_TEST,
    // URL endpoint to NEM network.
    url: 'http://localhost:3000'
}
