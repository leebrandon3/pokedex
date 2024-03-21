const submit = document.querySelector("#pokemonForm")

// Creates variables used to hold requested pokemon information
let pokemonName
let pokemonTypes = []
let pokemonStats = []
let pokemonSprite
let pokemonCries
let pokemonId
const tableName = document.getElementById("name")
const tableTypes = document.getElementById("type")
const hp = document.getElementById("hp")
const atk = document.getElementById("atk")
const def = document.getElementById("def")
const spAtk = document.getElementById("sp-atk")
const spDef = document.getElementById("sp-def")
const spd = document.getElementById("spd")
const tableSprite = document.getElementById("sprite")
// const tableCries = document.getElementById("cries")


// Listens for submit event, searching for pokemon entered in text box
submit.addEventListener("submit", event => {
    event.preventDefault()
    const pokemon = event.target.pokemon.value.toLowerCase()
    getRequest(pokemon)
})

// Cycles through pokemon based on their ID using the left/right arrow keys
document.body.addEventListener("keydown",event => {
    if (event.key == "ArrowLeft"){
        getRequest(pokemonId - 1)
    }
    if (event.key == "ArrowRight"){
        getRequest(pokemonId + 1)
    }
})

// Plays the displayed pokemons cry when clicking on the sprite image
document.querySelector("#sprite").addEventListener("click", event => {
    const playAudio = new Audio(pokemonCries)
    playAudio.play()
})

// Requests pokemon information on the pokemon API
function getRequest(pokemon){
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(response => response.json())
    .then(pokemonData => {
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
        pokemonSprite = pokemonData.sprites["front_default"]
        pokemonCries = pokemonData.cries.latest

        tableName.textContent = pokemonName

        tableTypes.textContent = pokemonTypes

        hp.textContent = `HP: ${pokemonStats[0]}`
        atk.textContent = `ATK: ${pokemonStats[1]}`
        def.textContent = `DEF: ${pokemonStats[2]}`
        spAtk.textContent = `SP ATK: ${pokemonStats[3]}`
        spDef.textContent = `SP DEF: ${pokemonStats[4]}`
        spd.textContent = `SPD: ${pokemonStats[5]}`

        tableSprite.src = pokemonSprite
        // tableCries.src = pokemonCries

        pokemonId = pokemonData.id
    })
    .catch(error => {
        console.log(error)
    })
}

function main(){
    getRequest("pikachu")
}
main()