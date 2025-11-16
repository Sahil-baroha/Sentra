import { Server } from "socket.io"


let connections = {}
let messages = {}
let timeOnline = {}

export const ConnectionToSocket = (server) => {
    const io = new Server(server)

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {
            if (connections[path] == undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)
            timeOnline[socket.id] = new Date();

            connections[path].forEach(elem => {
                io.to(elem).emit("user-joined", socket.id)
            });
            if (messages[path]!= undefined) {
                for(let a=0;a<messages[path].length;++a){
                    io.to(socket.id).emit("chat-message",messages[path][a]['data'],
                        messages[path][a]['sender'],messages[path][a]['socket-id-sender']
                    )
                }
            }
        })

        socket.on("signal", (toId, messages) => {
            io.to(toId).emit("signal", socket.id, messages);
        })

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(([room, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true];
                }
                return [room, isFound]
            }, ['', false])  
        })

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id]- new Date())
            var key ;
            for (const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for (let a=0;a<v.length;++a) {
                    if (v[a]){
                        key = k
                        for (let a=0;connections[key].length;++a){
                            io.to(connections[key][a]).emit('user-left',socket.id)
                        }
                        var index = connections[key].indexOf(socket.id)
                        connections[key].splice(index,1)
                        if (connection[key].length==0) {
                            delete connections[key]
                        }
                    }
                }
            }
        })

    })

    return io;
};  