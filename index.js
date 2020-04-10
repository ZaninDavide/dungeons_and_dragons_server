var express = require("express")
var app = express()
const cors = require("cors")
app.use(cors())
var http = require("http").createServer(app)
var io = require("socket.io")(http)

const { initGame, newPlayer, sendablePlayer } = require("./utilities")

let game = initGame()

app.use(express.static("public"))

app.get("/", function(req, res) {
    res.send("'Dungueons and Dragons' is listening")
})

app.get("/players", function(req, res) {
    res.send(game.players.map(sendablePlayer))
})

app.get("/players", function(req, res) {
    res.send(game.players.map(c => c.name))
})

io.on("connection", function(socket) {
    console.log("New connection")

    socket.on("join game", function(name) {
        // send game data to app
        socket.emit("players", { players: game.players.map(sendablePlayer) })
        // socket.emit("enemies", { enemies: game.enemies })
        // socket.emit("walls",   {   walls: game.walls   })

        // create a new player
        let new_player = newPlayer(socket, name)

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
})

http.listen(process.env.PORT || 5000, function() {
    console.log("listening on port: " + (process.env.PORT || 5000))
})