export function sendFeedback(token, session, comment, type) {
    //todo for organization
    return new Promise((resolve, reject) => {
    fetch('api/feedback/predefined_feedback', {
            method: 'post',
            body: JSON.stringify({
                token: token,
								sessionId: session,
                feedback: comment,
                type: type
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json())
        .then(response => {
			if (response.error) return reject(response.error);
			else resolve(response.message);
        }).catch(error => {
            return reject(error);
        });
    })

}
