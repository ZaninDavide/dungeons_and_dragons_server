var express = require("express")
var app = express()
const cors = require("cors")
app.use(cors())
var http = require("http").createServer(app)
var io = require("socket.io")(http)

const { initGame, newPlayer } = require("./utilities")

let game = initGame()

app.use(express.static("public"))

app.get("/", function(req, res) {
    res.send("'Dungueons and Dragons' is listening")
})


app.post("/resetGame", function(req, res) {
    game = initGame()
    res.send("The game was reset")
})

io.on("connection", function(socket) {
    if (socket.player_name === undefined) return

    socket.on("join game", function(name) {
        // send game data to app
        socket.emit("players", { players: game.players })
        socket.emit("enemies", { enemies: game.enemies })
        socket.emit("walls",   {   walls: game.walls   })

        // create a new player
        let new_player = newPlayer(socket, name)

        socket.player_name = name
        
        // tell everyone else a new player as connected
        io.emit("new player", {
            name: new_player.name,
        })
        
        // add this player to the players list
        game.players.push(new_player)
    })

    socket.on("disconnect", function() {
        if (socket.player_name === undefined) return

        const player = game.players.filter(player => player.name === socket.player_name)[0]

        // comunicate that player has disconnected
        io.emit("player disconnect", {
            name: player.name,
        })

        // remove player from game.players
        game.players = game.players.filter(
            player => player.name !== socket.player_name
        )
    })
})

http.listen(process.env.PORT || 5000, function() {
    console.log("listening on port: " + (process.env.PORT || 5000))
})