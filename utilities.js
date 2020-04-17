function initGame(){
    return {
        players: [],
        enemies: [],
        species: {},
          walls: [],
    }
}

function isFree(game, x, y){
    return  game.players.filter(p => p.x === x && p.y === y).length === 0 && 
            game.enemies.filter(e => e.x === x && e.y === y).length === 0 &&
            game.walls.filter(  w => w.x === x && w.y === y).length === 0
}

function firstEmptyCell(game){
    let x = 0
    let free = false
    while(!free){
        if(isFree(game, x, 0)) free = true
        x++
    }
    return {x: x-1, y: 0}
}

function newPlayer(socket, name, x = 0, y = 0, max_hp = 15, ca = 10, ini = 3, color = "#61ADFF"){
    return {
        socket,
        name,
        max_hp: max_hp,
        hp: max_hp,
        x,
        y,
        color,
        ca,
        ini,
        type: "player",
        master: false,
    }
}

function newEnemy(name, species = "zombie", x = 0, y = 0, max_hp = 10, ca = 12){
    return {
        name,
        species,
        max_hp: max_hp,
        hp: max_hp,
        x,
        y,
        ca,
        type: "enemy",
    }
}

function newSpecies(name, max_hp, ca, color = "#f3c623"){
    return {
        name,
        max_hp,
        ca,
        color,
    }
}

function newWall(x, y){
    return {
        x,
        y,
        type: "wall",
    }
}

function sendablePlayer(player){
    return {
        name: player.name,
        max_hp: player.max_hp,
        hp: player.hp,
        x: player.x,
        y: player.y,
        color: player.color,
        ca: player.ca,
        ini: player.ini,
        type: player.type,
        master: player.master,
    }
}

function firstFreeName(enemies, species){
    let allNames = enemies.reduce((acc, en) => [...acc, en.name], [])
    let name = ""
    let n = 1
    while(!name){
        if(allNames.length === 0){
            name = species[0].toUpperCase() + "1"
        }else{
            if(allNames.indexOf(species[0].toUpperCase() + n.toString()) === -1){
                name = species[0].toUpperCase() + n.toString()
            }else{
                n++
            }
        }
    }
    return name
}

module.exports = { initGame, newPlayer, sendablePlayer, firstEmptyCell, newEnemy, newSpecies, firstFreeName, newWall }