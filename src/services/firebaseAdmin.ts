import * as admin from 'firebase-admin';

const serviceAccount = require('../../android/app/google-services.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dineconnectapp.firebaseio.com',
});

export const generateCustomToken = async (uid: string) => {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    console.log('Custom token generated:', customToken);
    return customToken;
  } catch (error) {
    console.error('Error generating custom token:', error);
    throw error;
  }
};

export default admin;
