import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyATig-C6CAIafyUk2QOeZBNYSgdk0A0x_4",
    authDomain: "puppy-swap.firebaseapp.com",
    databaseURL: "https://puppy-swap.firebaseio.com",
    projectId: "puppy-swap",
    storageBucket: "puppy-swap.appspot.com",
    messagingSenderId: "238153887443"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const auth = firebase.auth;
export const provider = new firebase.auth.GoogleAuthProvider();

export default firebase;
