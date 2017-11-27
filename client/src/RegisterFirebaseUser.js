import firebase from 'firebase';

/*
Available functions:
    createAccount(displayName, email, password)
    login(email, password)
    getIdToken()
*/
const log = (message) => { console.log("[RegisterFirebaseUser.js]", message); }

/*
Description: Generates a user account in Firebase, upon which a parallel
user account is established in the backend database. The two accounts are to
be linked logically by the firebase-generated user id.
Preconditions: Provide a display name, email address, and password to be associated with the user's account.
Postconditions: The user shall be registered on Firebase and on the backend database.
On Success: Returned promise resolves as true.
*/
export function createAccount(displayName, email, password) {
    return new Promise((resolve, reject) => {
        if (displayName && email && password) {
            log("Creating firebase and backend user accounts for", displayName + ".");

            fetch('/api/account/verify', {
                method: 'post',
                body: JSON.stringify({
                    displayName: displayName
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    response.json().then((data) => {
                        if (data.isUnique) {
                            firebase.auth().createUserWithEmailAndPassword(email, password)
                                .then(user => {
                                    user.updateProfile({
                                        displayName: displayName
                                    }).catch(error => {
                                        reject('auth/invalid-name');
                                    });

                                    // Create backend account upon successful firebase registration
                                    user.getIdToken()
                                        .then(token => {
                                            fetch('/api/account/createAccount', {
                                                method: 'post',
                                                body: JSON.stringify({
                                                    displayName: displayName,
                                                    email: email,
                                                    token: token
                                                }),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json'
                                                }
                                            }).then((response)) => {
                                                if (response.status === 200) {
                                                    log("Successfully created both firebase and backend accounts for", displayName);
                                                    resolve();
                                                } else {
                                                    reject({ code: 'auth/backend-error' });
                                                }
                                            // Backend API returned an error
                                            }).catch(error => { reject(error); })
                                        // Unable to retrieve user login session
                                        }).catch(error => { reject(error); });
                                // Unable to create user in Firebase
                                }).catch(error => { reject(error); });
                        } else {
                            reject({ code: 'auth/name-already-in-use'});
                        }
                    // Invalid JSON response from backend
                    }).catch((error) => { reject(error); })
                } else if (response.status === 500) {
                    reject({ code: 'auth/backend-error'});
                }
            // Network failure in communicating with backend
            }).catch((error) => { reject(error); })
        }
    })
}

/*
Description: Creates a login session using Firebase's authentication service.
Preconditions:
    1. Provide the email address and password of the user to be logged in.
    2. User must not be logged in already.
Postconditions: The user shall be logged in to Firebase.
On Success: Returned promise resolves as true.
*/
export function login(email, password) {
    return new Promise((resolve, reject) => {
        if (email && password) {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    user.getIdToken()
                        .then((token) => { resolve(true) })
                        .catch((error) => { reject(error) });
                }).catch(error => {
                reject(error);
            });
        }
    })
}

/*
Description: Creates a login session using Firebase's authentication service.
Precondition: User must be logged in.
Postconditions: The user shall be logged in to Firebase.
On Success: Returned promise resolves to authentication token.
*/
export function getIdToken() {
    return new Promise((resolve, reject) => {
        firebase.auth().currentUser.getIdToken()
            .then(token => {
                if (token) resolve(token);
                reject("User is not logged in.");
            })
            .catch(error => { reject(error); })
    })
}
