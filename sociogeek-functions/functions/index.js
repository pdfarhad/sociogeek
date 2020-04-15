const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express');
const app = express();
const firestoreService = require('firestore-export-import');
const firebase = require('firebase');
var serviceAccount = require('../../../sociogeek/sociogeek-1cfbb-firebase-adminsdk.json');

const databaseURL = 'https://sociogeek-1cfbb.firebaseio.com';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

const db = admin.firestore();
// admin.initializeApp();
var firebaseConfig = {
    apiKey: "AIzaSyDdlZ6UkFvyHus_uwmWQvuGM8JANUpu40A",
    authDomain: "sociogeek-1cfbb.firebaseapp.com",
    databaseURL: "https://sociogeek-1cfbb.firebaseio.com",
    projectId: "sociogeek-1cfbb",
    storageBucket: "sociogeek-1cfbb.appspot.com",
    messagingSenderId: "217905569579",
    appId: "1:217905569579:web:1fe08c3f9be1466a64af6e",
    measurementId: "G-3D59C5MFVR"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firestoreService.initializeApp(serviceAccount, databaseURL);

app.get('/geekshots', (request, response) => {
    db
        .collection("geekshots")
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            let shots = [];
            data.forEach(doc => {
                shots.push({
                    shotId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                    // ...doc.data()
                });//doc.data()
            });
            return response.json(shots);
        })
        .catch(err => console.log(err));
});

// JSON To Firestore
const jsonToFirestore = async () => {
    try {
      console.log('Initialzing Firebase');
      console.log('Firebase Initialized');
  
      await firestoreService.restore('../pentesters.json');
      console.log('Upload Success');
    }
    catch (error) {
      console.log(error);
    }
  };
  
app.get('/upload-pentesters',( request, response) =>{
    jsonToFirestore();
})
app.post( '/geekshot',(request, response)=>{

    // if(request.method !== 'POST'){
    //     return response.status(400).json({error: "Method not allowed"});
    // }
    const newGeekShots = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: new Date().toISOString()
    };
    db
        .collection("geekshots")
        .add(newGeekShots)
        .then((doc) =>{
            response.json({ message: `Document ${doc.id} was created sucesfully` })
        })
        .catch((err)=>{
            response.status(500).json({ error: 'Something was wrong' });
            console.error(err);
        });

});

// Signup 

app.post('/signup', (request, response) =>{

    const newUser = {
        email : request.body.email,
        password : request.body.password,
        confirmPassword : request.body.confirmPassword,
        handle : request.body.handle
    }

    db.doc(`/users/$`)


    firebase.auth().createUserWithEmailAndPassword( newUser.email, newUser.password)
        .then( data => {
            return response.status(201).json({ message: `user ${data.user.uid} signed up successfully`})
        })
        .catch( err => {
            console.error(err);
            return response.status(500).json({ error: err.code })
        })

})

exports.api = functions.region('asia-northeast1').https.onRequest(app); //