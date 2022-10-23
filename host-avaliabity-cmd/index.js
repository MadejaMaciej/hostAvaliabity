const { checkHostAvaliabity } = require('./checkHostAvaliabity')

// Zbieramy na początek argumenty podane (w razie jakby był więcej niż jeden)
var parametersToRun = []
var argumentsCMD = []
var parameters = process.argv
var parameterFound = false
for (let i = 0; i < parameters.length; i++) {
    if (parameters[i][0] == '-') {
        parametersToRun.push(parameters[i])
        argumentsCMD.push([])
        parameterFound = true
    }

    if (parameterFound && parameters[i][0] != '-') {
        argumentsCMD[argumentsCMD.length - 1].push(parameters[i])
    }
}

if (!parameterFound) {
    argumentsCMD = process.argv.splice(2)
}

// Uruchamiamy to co chcemy sprawdzić
runCommands(parametersToRun.length, parametersToRun)

/**
 * 
 * @param {liczba} parametersLength liczba wszystkich parametrow, ktore chcemy odpalic 
 * @param {lista} parameters lista wszystkich parametrow 
 */
function runCommands(parametersLength, parameters) {
    if (parametersLength == 0) {
        checkHostAvaliabity(argumentsCMD)
        return
    }

    for (let i = 0; i < parametersLength; i++) {
        switch (parameters[i]) {
            case '-c':
                checkHostAvaliabity(argumentsCMD[i])
                break
            default:
                console.log(`Parametr ${parameters[i]} nie istnieje w kontekscie wykonania programu. Zostanie on pominiety. Aby uzyskac pomoc wpisz polecenie w terminalu "node help"`)
                break
        }
    }
}