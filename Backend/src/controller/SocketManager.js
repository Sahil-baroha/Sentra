import { Server } from "socket.io"

let RoomConnections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("SOMETHING CONNECTED", socket.id)

        // join-call accepts either a string roomId or an object { roomId, username }
        socket.on("join-call", ({ roomId, username }) => {
            console.log(`[BACKEND] join-call received for Room: ${roomId}, User: ${username}, Socket: ${socket.id}`);
            if (!roomId) {
                console.log(`[BACKEND] ERROR: roomId is missing!`);
                return
            }

            socket.join(roomId)
            socket.data.roomId = roomId

            timeOnline[socket.id] = new Date()

            if (!RoomConnections[roomId]) {
                console.log(`[BACKEND] Creating new room: ${roomId}`);
                RoomConnections[roomId] = {
                    admin: socket.id,
                    members: [],
                    usernames: {}
                }
            }

            RoomConnections[roomId].members.push(socket.id)
            if (username) RoomConnections[roomId].usernames[socket.id] = username

            console.log(`[BACKEND] Room ${roomId} members: ${RoomConnections[roomId].members.length}`);

            // The `clients` variable here would contain all members *including* the newly joined socket.id
            const allRoomClients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

            // Iterate over all members currently in the room (including the new one)
            RoomConnections[roomId].members.forEach(elem => {
                let clientsToSend = [];
                if (elem === socket.id) {
                    // If it is the user who just joined, give them the list of all other users
                    clientsToSend = allRoomClients;
                    console.log(`[BACKEND] Sending FULL client list to New User ${socket.id}:`, clientsToSend);
                } else {
                    // For existing users, just tell them about the new guy
                    clientsToSend = [socket.id];
                    console.log(`[BACKEND] Announcing New User ${socket.id} to Existing User ${elem}`);
                }
                // Send the "user-joined" event with the appropriate list of clients
                io.to(elem).emit("user-joined", socket.id, clientsToSend)
            });


            // Relay signaling messages (SDP / ICE)
            socket.on("signal", (toId, message) => {
                console.log(`[BACKEND] Relaying SIGNAL from ${socket.id} to ${toId}`);
                io.to(toId).emit("signal", socket.id, message)
            })

            // Chat messaging: find the room the socket is in, store and broadcast
            socket.on("chat-message", (data, sender) => {
                // try to find a room from socket.rooms (first non-own room)
                let matchingRoom = null
                for (const r of socket.rooms) {
                    if (r !== socket.id) {
                        matchingRoom = r
                        break
                    }
                }

                // fallback: search RoomConnections metadata
                if (!matchingRoom) {
                    for (const [roomKey, roomObj] of Object.entries(RoomConnections)) {
                        if (roomObj.members && roomObj.members.includes(socket.id)) {
                            matchingRoom = roomKey
                            break
                        }
                    }
                }

                if (!matchingRoom) return

                if (messages[matchingRoom] === undefined) messages[matchingRoom] = []

                messages[matchingRoom].push({
                    sender,
                    data,
                    "socket-id-sender": socket.id,
                    timestamp: Date.now()
                })

                // Broadcast to entire room (including sender)
                io.to(matchingRoom).emit("chat-message", data, sender, socket.id)
                console.log("message", matchingRoom, ":", sender, data)
            })

            // Handle disconnect: notify rooms, update metadata, cleanup
            socket.on("disconnect", () => {
                try {
                    const joinedAt = timeOnline[socket.id]
                    const diffTime = joinedAt ? Math.abs(new Date() - joinedAt) : null
                    // remove timeOnline entry
                    delete timeOnline[socket.id]

                    // Iterate metadata to find rooms where this socket was a member
                    for (const [roomId, roomObj] of Object.entries(RoomConnections)) {
                        const idx = roomObj.members.indexOf(socket.id)
                        if (idx !== -1) {
                            // Notify remaining room members (socket.to will skip the disconnected socket)
                            socket.to(roomId).emit("user-left", socket.id, { durationMs: diffTime })

                            // Remove from metadata
                            roomObj.members.splice(idx, 1)
                            if (roomObj.usernames) delete roomObj.usernames[socket.id]

                            // Reassign admin if needed
                            if (roomObj.admin === socket.id) {
                                roomObj.admin = roomObj.members.length > 0 ? roomObj.members[0] : null
                            }

                            // If room empty, clean up metadata and optional chat history
                            if (roomObj.members.length === 0) {
                                delete RoomConnections[roomId]
                                delete messages[roomId]
                            }
                        }
                    }
                } catch (e) {
                    console.log("disconnect cleanup error:", e)
                }
            })
        })

    });
    return io;
}
