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
            game.enemies.filter(e => e.x === x && e.y === y).length === 0
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

function newPlayer(socket, name, x = 0, y = 0, max_hp = 15, ca = 10, color = "#61ADFF"){
    return {
        socket,
        name,
        max_hp: max_hp,
        hp: max_hp,
        x,
        y,
        color,
        ca,
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

function sendablePlayer(player){
    return {
        name: player.name,
        max_hp: player.max_hp,
        hp: player.hp,
        x: player.x,
        y: player.y,
        color: player.color,
        ca: player.ca,
        type: player.type,
        master: player.master,
    }
}

module.exports = { initGame, newPlayer, sendablePlayer, firstEmptyCell, newEnemy, newSpecies }