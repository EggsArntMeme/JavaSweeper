// import fs from 'fs'
// fs.writeFileSync('my-data.json', json_string, 'utf8')
import { getScore } from "./api";


const body = document.querySelector('.flex');

let gameOver = false

const numOfTotalBombs = 40
let numberOfFlags = numOfTotalBombs
let score = 0

let dim = [15,15];




function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Square {
    constructor(isBomb, cords, parentList) {
        this.isBomb = isBomb
        this.cords = cords
        this.parentList = parentList
        this.numberOfBombs = 0
        this.visible = false
        this.surroundingBoxes = []
        this.flagged = false
    }
    collectSuroundings() {

        // console.log(this.cords)
        // console.log(`(!this.cords[0] - 1) < 0    RETURNS ${(!this.cords[0] - 1) < 0 }`)

        if ((!this.cords[0] - 1) < 0 ) {   
            // console.log(`(this.cords[1] - 1) >= 0   RETURNS ${((this.cords[1] - 1) >= 0)}`)
            
            if ((this.cords[1] - 1) >= 0) {
                this.surroundingBoxes.push(this.parentList[this.cords[0] - 1][this.cords[1] - 1])
                //  0  X  X
                //  X  X  X
                //  X  X  X        

            }
            this.surroundingBoxes.push(this.parentList[this.cords[0] - 1][this.cords[1]])
            //  X  0  X
            //  X  X  X
            //  X  X  X 

            // console.log(`(this.cords[1] + 1) < dim[1]   RETURNS ${(this.cords[1] + 1) < dim[1]}`)
            if ((this.cords[1] + 1) < dim[1]) {
                this.surroundingBoxes.push(this.parentList[this.cords[0] - 1][this.cords[1] + 1])
                //  X  X  0
                //  X  X  X
                //  X  X  X 
            }   
        }


        if ((this.cords[1] - 1) >= 0) {

            this.surroundingBoxes.push(this.parentList[this.cords[0]][this.cords[1] - 1])
            //  X  X  X
            //  0  X  X
            //  X  X  X 
        } 
        if  ((this.cords[1] + 1) < dim[1]) {
            this.surroundingBoxes.push(this.parentList[this.cords[0]][this.cords[1] + 1])
            //  X  X  X
            //  X  X  0
            //  X  X  X 
        }


        if ((this.cords[0] + 1) < dim[0]) {
            if ((this.cords[1] - 1) >= 0) {
                this.surroundingBoxes.push(this.parentList[this.cords[0] + 1][this.cords[1] - 1])
                //  X  X  X
                //  X  X  X
                //  0  X  X 
            }
            this.surroundingBoxes.push(this.parentList[this.cords[0] + 1][this.cords[1]])
            //  X  X  X
            //  X  X  X
            //  X  0  X 
            if ((this.cords[1] + 1) < dim[1]) {
                this.surroundingBoxes.push(this.parentList[this.cords[0] + 1][this.cords[1] + 1])
                //  X  X  X
                //  X  X  X
                //  X  X  0 
            }   
        }
    }
    checkForBombs() {
        if (!this.visible){
            this.surroundingBoxes.forEach((box) => {
                if (box.isBomb) {
                    this.numberOfBombs += 1
                }
            })
        }
        }

    revealSelf() {
        if (!this.flagged) {
            this.checkForBombs()
            if (!this.visible && !this.flagged) {
                this.visible = true 

                if (this.numberOfBombs == 0) {
                    console.log(`${this.cords} IS CLEAR OF BOMBS`)

                    this.surroundingBoxes.forEach((box) => {box.revealSelf()})
                }
            }
        }
    } 

}

let masterList = []
for (let i = 0; i < dim[0]; i++) {
    let rowList = []
    for (let j = 0; j < dim[1]; j++) {
        rowList.push(new Square(false, [i,j], masterList))
        
    }
    masterList.push(rowList)
}

function setBombs(firstClickedBox) {
    for (let i = 0; i < numOfTotalBombs; i++){ 
        while (true) {
            let randomCord = [getRandomInt(dim[0]), getRandomInt(dim[1])]
            if (!masterList[randomCord[0]][randomCord[1]].isBomb && (masterList[randomCord[0]][randomCord[1]] != firstClickedBox && !firstClickedBox.surroundingBoxes.includes(masterList[randomCord[0]][randomCord[1]]))) {
                console.log(firstClickedBox.surroundingBoxes.includes(masterList[randomCord[0]][randomCord[1]]))
                
                masterList[randomCord[0]][randomCord[1]].isBomb = true
                console.log(randomCord)
                break
            }
        }
    }
}



for (let i = 0; i < masterList.length; i++) {
    for (let j = 0; j < masterList[i].length; j++) {
        masterList[i][j].collectSuroundings()
        // console.log(masterList[i][j].cords)
        // console.log(masterList[i][j].surroundingBoxes)
        // console.log('')
    }

}





let firstClick = false
let flagToggle = false

initializeBoxes()
function initializeBoxes() {
    for (let i = 0; i < masterList.length; i++) {
        
        const row = document.createElement('div')
        row.classList.add('flex')
        body.appendChild(row)


        for (let j = 0; j < masterList[i].length; j++) {
    
            const boxDiv = document.createElement('div')
            boxDiv.classList.add(`${i},${j}`)
            boxDiv.classList.add('covered')

        
            row.appendChild(boxDiv)
            boxDiv.addEventListener('click', () => {
                let clickedBox = masterList[boxDiv.classList[0].split(',')[0]][boxDiv.classList[0].split(',')[1]]

                if (!gameOver) {
                    
                        if (!flagToggle && boxDiv.innerHTML == '') {
                            if (!clickedBox.isBomb) {
                                if (!firstClick) {
        
                                    setBombs(masterList[boxDiv.classList[0].split(',')[0]][boxDiv.classList[0].split(',')[1]])
                                    firstClick = true    
                                }
                                
                                console.log(boxDiv.classList[0])
                                let clickedBox = masterList[boxDiv.classList[0].split(',')[0]][boxDiv.classList[0].split(',')[1]]
                                clickedBox.revealSelf()
                            } else {
                                gameOver = true
                                masterList.forEach((row) => {
                                    row.forEach((box) => {
                                        if (box.isBomb) {
                                            box.visible = true
                                        }
                                    })
                                })
                                body.innerHTML += "game over :("
                                renderBoxes()
                            }
            
            
                            renderBoxes()
                        } else if (flagToggle) {
                            if (!clickedBox.visible) {
                                if (boxDiv.innerHTML == '' && numberOfFlags > 0) {
                                    clickedBox.flagged = true
                                    boxDiv.innerHTML = `<img src="img/flag.png" alt="Flag Toggle" class="flag">`
                                    numberOfFlags -= 1
    
                                } else if (!boxDiv.innerHTML == '') {
                                    numberOfFlags += 1
                                    clickedBox.flagged = false
                                    boxDiv.innerHTML = ''
                                }
                            }
                            renderBoxes()
                        }
                    
                }
                
            })
        }
    }
}


function renderBoxes() {
    score = 0
    for (let i = 0; i < body.children.length; i++) {
    
        for (let j = 0; j < body.children[i].children.length; j++) {
            if (masterList[i][j].visible) {
                body.children[i].children[j].classList.remove('covered')
                
                if (masterList[i][j].numberOfBombs && !masterList[i][j].isBomb) {
                    body.children[i].children[j].innerHTML = `<span class='num-${masterList[i][j].numberOfBombs}'>${masterList[i][j].numberOfBombs}</span>`
                    score += 100 * masterList[i][j].numberOfBombs
                } else if (!masterList[i][j].numberOfBombs && !numOfTotalBombs.isBomb) {
                    score += 10
                }
                
                if (masterList[i][j].isBomb) {
                    body.children[i].children[j].classList.add('apple')

                } else {
                    body.children[i].children[j].classList.add('safe')
                }
            }
        }
        document.querySelector('#flag-number').innerHTML = numberOfFlags
        document.querySelector('#score').innerHTML = score

    }
    if (winCheck() && firstClick) {
        body.innerHTML += "YOU WIN"
        score += Math.floor(1000000 / parseInt(time.reverse().join('')))
        time.reverse()
        document.querySelector('#score').innerHTML = score

        testInterval = setInterval(() => {
            
            
        }, 5000)

    }
    if (gameOver) {
    }

}

renderBoxes()



window.addEventListener('keydown', (e) => {
    
switch (e.key) {
        case 'r':
            for (let i = 0; i < masterList.length; i++) {
                for (let j = 0; j < masterList[i].length; j++) {
                    masterList[i][j].checkForBombs()
                    masterList[i][j].visible = true
                }
                
            }
            renderBoxes()
    }


    if (e.key == 'r') {
        for (let i = 0; i < masterList.length; i++) {
            for (let j = 0; j < masterList[i].length; j++) {
                masterList[i][j].checkForBombs()
                masterList[i][j].visible = true
            }
            
        }
        renderBoxes()
    } else if (e.key == ' ') {
        flagToggle = !flagToggle

        if (flagToggle) {
            flagToggleBtn.classList.add('toggle-true')
        } else {
            flagToggleBtn.classList.remove('toggle-true')

        }
    }
})
window.addEventListener('mousedown', (e) => {
    e.preventDefault()
    if (e.button == 2) {
        flagToggle = !flagToggle

        if (flagToggle) {
            flagToggleBtn.classList.add('toggle-true')
        } else {
            flagToggleBtn.classList.remove('toggle-true')

        }
    } else if (e.button == 1) {
        location.reload()
    }

})


const flagToggleBtn = document.getElementById('flag-toggle-true')
flagToggleBtn.addEventListener('click', (e) => {
    flagToggle = !flagToggle

    if (flagToggle) {
        flagToggleBtn.classList.add('toggle-true')
    } else {
        flagToggleBtn.classList.remove('toggle-true')

    }
}) 


function winCheck() {
    let winCondition = true
    masterList.forEach((row) => {
        row.forEach((box) => {
            if (!box.visible && !box.isBomb) {
                winCondition = false
            }
        })
    })
    if (winCondition && numberOfFlags == 0) {
        return true
    } else {
        return false
    }
}




// TIMER / CLOCK
let time = [0, 0, 0, 0]

let testInterval = setInterval(() => {
    time[0] += 1    
    if (typeof(time) == 'object' && time[0] == 10) {
        time[0] = 0
        time[1] += 1
        if (time[1] == 6) {
            time[1] = 0
            time[2] += 1
            if (time[2] == 10) {
                time[2] = 0
                time[3] += 1
                if (time[3] == 6) {
                    time = 'LOG OFF BRO'
                }
            }
        }
    }
    document.querySelector('.time').innerHTML = `${time[3]}${time[2]}:${time[1]}${time[0]}`
    
    
    getScore()

}, 1000)





// test = {
//     name: 'bruh',
//     scoreNum: 2000
// }
// const writeJsonToFile = (path='../data/score.json', data) => {
//     try {
//       fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
//       console.log('Data successfully saved to disk')
//     } catch (error) {
//       console.log('An error has occurred ', error)
//     }
//   }

// writeJsonToFile(data=test)




// import fs from 'fs'

// const data = {              
//   name: 'Super Software LLC',
//   orgIds: [1,3,7,11]
// }

// writeJsonToFile('my-data.json', data)