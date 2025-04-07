
function getScore() {
    const BASE_URL = 'https://java-sweeper.netlify.app/data/score.json';
    const TEST_URL = 'http://localhost:3000/'
    return fetch(`${BASE_URL}`)   
        .then((response) => { 
            console.log(response)
            return response.json();
        })
        .then ((postData) => {
            console.log(postData)
            return postData
        })
}

export {getScore}