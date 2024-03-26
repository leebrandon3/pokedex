// Creates variables used to hold requested pokemon information
let pokemonName
let pokemonTypes = []
let pokemonStats = []
let pokemonSprite
let pokemonCries
let pokemonId
let movesList = []
let move

// Variables for DOM manipulation
const submit = document.querySelector("#pokemonForm")
const tableName = document.getElementById("name")
const tableTypes = document.getElementById("type")
const hp = document.getElementById("hp")
const atk = document.getElementById("atk")
const def = document.getElementById("def")
const spAtk = document.getElementById("sp-atk")
const spDef = document.getElementById("sp-def")
const spd = document.getElementById("spd")
const tableSprite = document.getElementById("sprite")
const movesTable = document.getElementById("moves-table")
let movesTableData = document.getElementById("moves-list")
const moveDesc = document.getElementById("move-desc")

// Listens for submit event, searching for pokemon entered in text box
submit.addEventListener("submit", event => {
    event.preventDefault()
    const pokemon = event.target.pokemon.value.toLowerCase()
    clearMoves()
    getRequest(pokemon)
})

// Listens for keydown event. Cycles through pokemon based on their ID using the left/right arrow keys
document.body.addEventListener("keydown",event => {
    if (event.key == "ArrowLeft"){
        clearMoves()
        getRequest(pokemonId - 1)
    }
    if (event.key == "ArrowRight"){
        clearMoves()
        getRequest(pokemonId + 1)
    }
})

// Listens for clicking event on a stat, opens an alert that provides more information on the stat.
document.getElementById("stats").addEventListener("click", event => {
    /**
     * Sends an alert on the page based on clicking event
     * @param {string} id 
     * @param {string} text 
     */
    function alertStat(id, text){
        if(event.target.id == id){
            alert(text)
        }
    }
    alertStat("hp", "The HP stat, short for Hit Points, determines how much damage a pokemon can receive before fainting.")
    alertStat("atk", "The Attack stat, or informally Physical Attack, partly determines how much damage a Pokémon deals when using a physical move.")
    alertStat("def", "The Defence stat, or informally Physical Defense, partly determines how much damage a Pokémon receives when it is hit with a physical move.")
    alertStat("sp-atk", "The Special Attack stat, partly determines how much damage a Pokémon deals when using a special move.")
    alertStat("sp-def", "The Special Defence stat, partly determines how much damage a Pokémon receives when it is hit with a special move.")
    alertStat("spd", "The Speed stat determines the order of Pokémon that can act in battle. If Pokémon are moving with the same priority, Pokémon with higher Speed at the start of any turn will generally make a move before ones with lower Speed; in the case that two Pokémon have the same Speed, one of them will randomly go first.")
})

// Listens for click event on image, plays the displayed pokemons cry when clicking on the sprite image
document.querySelector("#sprite").addEventListener("click", () => {
    const playAudio = new Audio(pokemonCries)
    playAudio.play()
})

// Listens for click event on moves and updates text content of moves description
function moveEvent(move){
    move.addEventListener("click", event => {
        const selectedMove = movesList.find(element => element.name == event.target.textContent)
        fetch(selectedMove.url)
        .then(response => response.json())
        .then(promise => {
            updateMove("move-name", `Name: ${promise.name}`)
            updateMove("move-power", `Power: ${promise.power}`)
            updateMove("move-accuracy", `Accuracy: ${promise.accuracy}`)
            updateMove("move-pp", `Power Point: ${promise.pp}`)
            updateMove("move-type", `Type: ${promise.type.name}`)
        })
    })
}

/**
 * Updates move description
 * @param {string} moveAtt 
 * @param {string} fetchAtt 
 */
function updateMove(moveAtt, fetchAtt){
    console.log(moveAtt, fetchAtt)
    document.getElementById(moveAtt).textContent = fetchAtt
}

/**
 * Removes current moves list
 */
function clearMoves(){
    movesTable.removeChild(movesTableData)
    console.log(movesTableData)
    movesTableData = document.createElement("ul")
    movesTableData.id = "moves-list"
    movesTable.append(movesTableData)
    moveEvent(movesTableData)
}

/**
 * Requests pokemon information on the pokemon API
 * @param {string} pokemon 
 */
function getRequest(pokemon){
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(response => response.json())
    .then(pokemonData => {
        // Saves promise for GET and saves in global variables
        pokemonName = pokemonData.name
        let i = 0;
        for(const element of pokemonData.types){
            pokemonTypes[i] = element.type.name
            i++
        }
        let a = 0;
        for(const element of pokemonData.stats){
            pokemonStats[a] = element["base_stat"]
            a++
        }
        pokemonSprite = pokemonData.sprites.other.showdown["front_default"]
        pokemonCries = pokemonData.cries.latest
        pokemonId = pokemonData.id
        movesList = []
        
        pokemonData.moves.forEach(element => {
            movesList.push(element.move)
            const move = document.createElement("li")
            move.textContent = element.move.name
            move.id = element.move.name
            movesTableData.append(move)
        })
        moveEvent(movesTableData)
        
        // Updates web-page with data obtained using GET
        tableName.textContent = pokemonName
        tableTypes.textContent = pokemonTypes
        hp.textContent = `HP: ${pokemonStats[0]}`
        atk.textContent = `ATK: ${pokemonStats[1]}`
        def.textContent = `DEF: ${pokemonStats[2]}`
        spAtk.textContent = `SP ATK: ${pokemonStats[3]}`
        spDef.textContent = `SP DEF: ${pokemonStats[4]}`
        spd.textContent = `SPD: ${pokemonStats[5]}`
        tableSprite.src = pokemonSprite
    })
    .catch(error => {
        console.log(error)
    })
}

function main(){
    getRequest("pikachu")
}
main()