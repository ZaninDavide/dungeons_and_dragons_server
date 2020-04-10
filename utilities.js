function initGame(){
    return {
        players: [],
        enemies: [],
          walls: [],
    }
}

function newPlayer(socket, name, max_hp = 15, ca = 10, x = 0, y = 0, color = "#ff6363"){
    return {
        socket,
        name,
        max_hp: max_hp,
        hp: max_hp,
        x,
        y,
        color,
        ca,
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
    }
}

module.exports = { initGame, newPlayer, sendablePlayer }