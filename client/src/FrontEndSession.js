import firebase from 'firebase';
var request = require('request');

export function createBackendSession(idToken) {

    return new Promise((resolve, reject) => {

        if (idToken) {
			//Posts a request to backend to create a session
            fetch('api/sessionSetup/createSession', {
				method: 'post',
				body: JSON.stringify({
					token: idToken
				}),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(response => response.json())
			.then(response => {
				//this should return the session access code
				resolve(response.accessCode);

			}).catch(error => {
				console.log(error);
				return reject(error);
			});
        }
    })
}

export function joinBackendSession(idToken, code) {
		return new Promise((resolve, reject) => {
				if(idToken) {
						fetch('/api/session/join', {
								method: 'post',
								body: JSON.stringify({
										token: idToken,
										accessCode: code
								}),
								headers: {
										'Content-Type': 'application/json',
										'Accept': 'application/json'
								}
						})
						.then(response => response.json())
						.then(response => {
								resolve(response.key);
						})
						.catch(error => {
								console.log(error);
								return reject(error);
						});
				}
		});
}
