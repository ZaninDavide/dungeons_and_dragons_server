function initGame(){
    return {
        players: [],
        enemies: [],
          walls: [],
    }
}

function newPlayer(socket, name, max_hp = 15, x = 0, y = 0, color = "blue"){
    return {
        socket,
        name,
        max_hp: max_hp,
        hp: max_hp,
        x,
        y,
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
    }
}

module.exports = { initGame, newPlayer, sendablePlayer }