import { LanguageType } from 'store/reducers/locale/langugeType'

export const environment = {
  firebase: {
    apiKey: 'AIzaSyDmPyDOpac8zN7Zddm4KBMq2nWhiFNFR8k',
    authDomain: 'nem-apostille-social-39f6a.firebaseapp.com',
    databaseURL: 'https://nem-apostille-social-39f6a.firebaseio.com',
    projectId: 'nem-apostille-social-39f6a',
    storageBucket: 'nem-apostille-social-39f6a.appspot.com',
    messagingSenderId: '459525480120',
    appId: '1:459525480120:web:c3256b7d13ff071c'
  },
  settings: {
    enabledOAuthLogin: true,
    enabledOffline: true,
    appName: 'Apostille Demo',
    defaultProfileCover: 'https://firebasestorage.googleapis.com/v0/b/open-social-33d92.appspot.com/o/images%2F751145a1-9488-46fd-a97e-04018665a6d3.JPG?alt=media&token=1a1d5e21-5101-450e-9054-ea4a20e06c57',
    defaultLanguage: LanguageType.English
  },
  theme: {
    primaryColor: '#00b1b3',
    secondaryColor: '#4d545d'
  }
}
