const { exec } = require('child_process')

/**
 * Badanie czy host jest dostepny
 * @param {lista} args list argumentow, ktore bedziemy badac 
 */
function checkHostAvaliabity(args) {
    var fullElementsList = []
    args.forEach(element => {
        fullElementsList.push({
            host: element,
            isUp: false,
            time: 0,
            upTime: 0,
            downTime: 0,
            failureProbability: 0
        })
    })

    setInterval(async () => {
        fullElementsList.forEach((element, index, arr) => {
            exec(`ping ${element.host} -n 1 -w 1000`, (error, stdout, stderr) => {
                if (error) {
                    arr[index] = newElementParameters(arr[index], false)
                    return
                }

                if (stderr) {
                    arr[index] = newElementParameters(arr[index], false)
                    return
                }

                arr[index] = newElementParameters(arr[index], true)
            })
            displayResultInConsole(fullElementsList)
        })
    }, 1000)
}

/**
 * Zwraca nowy obiekt dla tablicy hostow
 * @param {obiekt} element ktory ma zostac zmieniony
 * @param {boolean} isUp czy element jest wlaczony 
 * @returns obiekt, ktory ma zostac przypisany do tablicy
 */
function newElementParameters(element, isUp) {
    if (isUp) {
        return {
            host: element.host,
            isUp: isUp,
            time: element.time / 1 + 1,
            upTime: element.upTime / 1 + 1,
            downTime: element.downTime / 1,
            failureProbability: (element.downTime / 1) / (element.time / 1 + 1) * 100,
        }
    }

    return {
        host: element.host,
        isUp: isUp,
        time: element.time / 1 + 1,
        upTime: element.upTime / 1,
        downTime: element.downTime / 1 + 1,
        failureProbability: (element.downTime / 1 + 1) / (element.time / 1 + 1) * 100,
    }
}

/**
 * Wyswietla w konsoli liste elementow
 * @param {lista} fullElementsList gotowych elementow do wyswietlenia
 */
function displayResultInConsole(fullElementsList) {
    console.log(fullElementsList)
}

module.exports = { checkHostAvaliabity }