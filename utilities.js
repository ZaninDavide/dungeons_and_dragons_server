function initGame(){
    return {
        players: [],
        enemies: [],
        walls: [],
    }
}

function newPlayer(socket, name, max_hp = 15){
    return {
        socket,
        name,
        max_hp: max_hp,
        hp: max_hp,
    }
}

module.exports = { initGame, newPlayer }