var express = require("express")
var app = express()
const cors = require("cors")
app.use(cors())
var http = require("http").createServer(app)
var io = require("socket.io")(http)

const { initGame, newPlayer, sendablePlayer, firstEmptyCell, newEnemy, newSpecies, firstFreeName, newWall } = require("./utilities")

let game = initGame()

app.use(express.static("public"))

app.get("/", function(req, res) {
    res.send("'Dungueons and Dragons' is listening")
})

app.get("/players", function(req, res) {
    res.send(game.players.map(sendablePlayer))
})

/*app.get("/stupidClearEnemies", function(req, res) {
    game.enemies = []
    io.emit("enemies", { enemies: game.enemies })
    console.log("Emenies deleted")
    res.send("Emenies deleted")
})*/

io.on("connection", function(socket) {
    console.log("New connection")

    socket.emit("players", { players: game.players.map(sendablePlayer) })
    socket.emit("enemies", { enemies: game.enemies })
    socket.emit("species", { species: game.species })
    socket.emit(  "walls", { walls: game.walls })

    socket.on("join game", function(name) {
        // send game data to app
        socket.emit("players", { players: game.players.map(sendablePlayer) })
        socket.emit("enemies", { enemies: game.enemies })
        socket.emit("species", { species: game.species })
        socket.emit("walls",   {   walls: game.walls   })

        // create a new player
        let firstFree = firstEmptyCell(game)
        let new_player = newPlayer(socket, name, firstFree.x, firstFree.y)

        socket.player_name = name
        
        // add this player to the players list
        game.players.push(new_player)

        // tell everyone else a new player as connected
        io.emit("players", {
            players: game.players.map(sendablePlayer),
        })

        console.log("'" + name + "' joined the game")
    })

    socket.on("disconnect", function() {
        if (socket.player_name === undefined) return

        const player = game.players.filter(player => player.name === socket.player_name)[0]
        if(!player) return
        const name = player.name.toString()

        // remove player from game.players
        game.players = game.players.filter(
            player => player.name !== socket.player_name
        )

        // comunicate that player has disconnected
        io.emit("players", {
            players: game.players.map(sendablePlayer),
        })

        console.log("'" + name + "' disconnected")
    })

    socket.on("move", function(name, new_x, new_y){
        let entity = game.players.filter(player => player.name === name)[0]
        if(!entity) entity = game.enemies.filter(enemy => enemy.name === name)[0]
        
        if(!entity) return
        entity.x = new_x
        entity.y = new_y

        if(entity.type === "player"){
            io.emit("players", { players: game.players.map(sendablePlayer) })
        }else if(entity.type === "enemy"){
            io.emit("enemies", { enemies: game.enemies })
        }
    })

    socket.on("color", function(name, new_color){
        let entity = game.players.filter(player => player.name === name)[0]
        if(!entity) entity = game.enemies.filter(enemy => enemy.name === name)[0]
        
        if(!entity) return
        entity.color = new_color

        if(entity.type === "player"){
            io.emit("players", { players: game.players.map(sendablePlayer) })
        }else if(entity.type === "enemy"){
            io.emit("enemies", { enemies: game.enemies })
        }
    })

    socket.on("hp_delta", function(name, delta){
        let entity = game.players.filter(player => player.name === name)[0]
        if(!entity) entity = game.enemies.filter(enemy => enemy.name === name)[0]
        
        if(!entity) return
        entity.hp += delta

        if(entity.type === "player"){
            io.emit("players", { players: game.players.map(sendablePlayer) })
        }else if(entity.type === "enemy"){
            /*if(entity.hp <= 0){
                // remove enemy
                game.enemies = game.enemies.filter(enemy => enemy.name !== name)

            }*/
            io.emit("enemies", { enemies: game.enemies })
        }
    })

    socket.on("newEnemy", function(species) {
        // create a new enemy
        let firstFree = firstEmptyCell(game)
        let name = firstFreeName(game.enemies, species)
        let new_enemy = newEnemy(name, species, firstFree.x, firstFree.y, game.species[species].max_hp,  game.species[species].ca)

        // add this player to the players list
        game.enemies.push(new_enemy)

        // tell everyone else about the new enemy
        io.emit("enemies", { enemies: game.enemies })

        console.log("'" + name + "' new enemy added")
    })
    
    socket.on("newSpecies", function(name, max_hp, ca) {
        let sp = newSpecies(name, max_hp, ca)
        game.species[name] = sp

        io.emit("species", { species: game.species })

        console.log("'" + name + "' new species added")
    })

    socket.on("speciesColor", function(species_name, new_color) {
        let sp = game.species[species_name]
        if(!sp) return

        sp.color = new_color

        io.emit("species", { species: game.species })

        console.log("Species '" + species_name + "' color changed")
    })

    socket.on("removeEnemie", function(name) {
        game.enemies = game.enemies.filter(enemy => enemy.name !== name)
        io.emit("enemies", { enemies: game.enemies })
        console.log("'" + name + "' removed.")
    })

    socket.on("changePlayerMaxHp", function(name, max) {
        let player = game.players.filter(player => player.name === name)[0]
        player.max_hp = max
        io.emit("players", { players: game.players.map(sendablePlayer) })
        console.log("'" + name + "' set max_hp to:" + max)
    })

    socket.on("changePlayerCA", function(name, ca) {
        let player = game.players.filter(player => player.name === name)[0]
        player.ca = ca
        io.emit("players", { players: game.players.map(sendablePlayer) })
        console.log("'" + name + "' set ca to:" + ca)
    })

    socket.on("addWall", function(x, y) {
        game.walls.push(newWall(x, y))
        io.emit("walls", { walls: game.walls })
    })

    socket.on("removeWall", function(x, y) {
        game.walls = game.walls.filter(w => w.x !== x || w.y !== y)
        io.emit("walls", { walls: game.walls })
    })

})

http.listen(process.env.PORT || 5000, function() {
    console.log("listening on port: " + (process.env.PORT || 5000))
})