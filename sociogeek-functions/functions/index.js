const functions = require('firebase-functions');
const admin = require('firebase-admin')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// admin.initializeApp();
admin.initializeApp();

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getGeekShots = functions.https.onRequest((request, response) => {
    admin.firestore().collection("geekshots").get()
        .then(data => {
            let shots = [];
            data.forEach(doc => {
                shots.push(doc.data());
            });
            return response.json(shots);
        })
        .catch(err => console.log(err));
});
exports.createGeetShots = functions.https.onRequest((request, response)=>{

    if(request.method !== 'POST'){
        return response.status(400).json({error: "Method not allowed"});
    }
    const newGeekShots = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt:admin.firestore.Timestamp.fromDate(new Date())
    };
    admin
        .firestore()
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