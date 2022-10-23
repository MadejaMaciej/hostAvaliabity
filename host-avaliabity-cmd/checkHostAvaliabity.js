const { exec } = require('child_process')
const CHECK_TIME = 1000

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

    // Sprawdzamy co 1000 milisekund pingiem czy host jest dostepny dla kazdego w liscie. To jest nieblokujace watku gdyz foreach dziala na zasadzie obietnic, 
    // tak samo jak funkcja exec, ktora po zwroceniu tego elementu, wykonuje funkcje wyswietlania
    setInterval(async () => {
        fullElementsList.forEach((element, index, arr) => {
            var netstatCheck = element.host.split('.')
            if (netstatCheck.length == 1) {
                exec(`netstat -ano | find "${element.host}" | find "LISTEN"`, (error, stdout, stderr) => {
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
                return
            }
            exec(`ping ${element.host} -n 1 -w ${CHECK_TIME}`, (error, stdout, stderr) => {
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
    }, CHECK_TIME)
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
            failureProbability: Math.round((((element.downTime / 1) / (element.time / 1 + 1)) * 100) * 100) / 100,
        }
    }

    return {
        host: element.host,
        isUp: isUp,
        time: element.time / 1 + 1,
        upTime: element.upTime / 1,
        downTime: element.downTime / 1 + 1,
        failureProbability: Math.round((((element.downTime / 1 + 1) / (element.time / 1 + 1)) * 100) * 100) / 100,
    }
}

/**
 * Wyswietla w konsoli liste elementow
 * @param {lista} fullElementsList gotowych elementow do wyswietlenia
 */
function displayResultInConsole(fullElementsList) {
    process.stdout.write('\x1b[H\x1b[2J')
    console.table(fullElementsList)
}

module.exports = { checkHostAvaliabity }