async function getScore() {
    // const BASE_URL = 'http://localhost:3000';
    const BASE_URL = 'https://java-sweeper.netlify.app'
    await fetch(`${BASE_URL}/score.json`)   
        .then((response) => {
            return response.json();
        })
        .then ((postData) => {
            return postData
        })
}

export {getScore}