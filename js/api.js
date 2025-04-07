
function getScore() {
    const BASE_URL = 'https://java-sweeper.netlify.app/data/score.json';
    return fetch(`${BASE_URL}`)   
        .then((response) => {
            return response.json();
        })
        .then ((postData) => {
            return postData
        })
}

export {getScore}