const express = require('express')
const SocketServer = require('ws').Server

const PORT = 3030

const server = express().listen(PORT, () => console.log(`Server Started. Listening on port ${PORT}`))
const wss = new SocketServer({ server })
//const wss = new WebSocket.Server({ port: 3030 })
const { v4: uuidv4} = require('uuid'); //uuidv4();

const question = require("./question");
const rooms = {};

wss.on('connection', (ws) => {

    const uuid = uuidv4(); // create here a uuid for this connection

    // send uuid to client
    ws.send(JSON.stringify(
        {
            action: 'uuid',
            uuid: uuid
        }
    ));
    
    const checkEndGame = (room) => {
        const playerCount = Object.keys(rooms[room]["playerList"]).length;
        return playerCount === rooms[room]["currentRound"];
    }

    const checkAllPlayerComplete = (room) => {
        const playerList = Object.keys(rooms[room]["playerList"]);
        for(let i = 0; i < playerList.length; i++){
            let complete = rooms[room]["playerList"][playerList[i]].completed;
            if(!complete){
                return false;
            }
        }
        return true;
    }

    const resetAllPlayerCompleteStatus = (room) => {
        const playerList = Object.keys(rooms[room]["playerList"]);
        for(let i = 0; i < playerList.length; i++){
            rooms[room]["playerList"][playerList[i]].completed = false;
        }
    }

    const findNextPlayerIndex = (room, uuid) => {

        const playerList = Object.keys(rooms[room]["playerList"]);
        let index = -1;
        for(let i = 0; i < playerList.length; i++){
            let playerUuid = rooms[room]["playerList"][playerList[i]].uuid;
            if(playerUuid === uuid){
                index = (i + rooms[room].currentRound) % playerList.length;
                break;
            }
        }
        return index;

    }

    const submitAnswerToPlayer = (room, ownerUuid, userName, answer, isDraw) => {
        const ans = {
            sender: userName,
            answer: answer,
			isDraw: isDraw
        };
        rooms[room]["playerList"][ownerUuid]["answerList"].push(ans);
    }

    const getRandomQuestion = (array) => {
        const copy = array.slice(0);
        return function() {
            if (copy.length < 1) { copy = array.slice(0); }
            const index = Math.floor(Math.random() * copy.length);
            const item = copy[index];
            copy.splice(index, 1);
            return item;
        };
    }

    const assignQuestionToPlayer = (room) => {
        const playerList = Object.keys(rooms[room]["playerList"]);
        for(let i = 0; i < playerList.length; i++){
            const playerUuid = rooms[room]["playerList"][playerList[i]].uuid;
            const randomQuestion = getRandomQuestion(question);
            submitAnswerToPlayer(room, playerUuid, playerUuid, randomQuestion(), false);
        }
    }

    const broadcasting = (room, content) => {
        let cache = [];
        const clearJSONCircularStr = JSON.stringify(content, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // 移除
                    return;
                }
                // 收集所有的值
                cache.push(value);
            }
            return value;
        });
        cache = null;
        /** clear JSON circular structure */

        // send to all client in the room
        if(typeof rooms[room] !== 'undefined'){
            Object.entries(rooms[room]["playerList"]).forEach(([, roomDatail]) => {
                roomDatail.socket.send(clearJSONCircularStr);
            });
        }
    }

    const updatePlayerList = (room) => {
        return {
            action: 'updatePlayerList',
            list: rooms[room]
        };
    }

    const findCurrentRoom = (room) => {
        for (const [key, value] of Object.entries(rooms)) {
            if(key === room){
                return rooms[room];
            }
        }
        return 0;
    }

    const updateStatus = (room, uuid, key, value) => {
        const currentRoom = findCurrentRoom(room);
        if(currentRoom != 0){
            currentRoom["playerList"][uuid][key] = value;
            rooms[room] = currentRoom;
            broadcasting(room,updatePlayerList(room));
        }
    }

    const leave = room => {
        // not present: do nothing
        if(! rooms[room]["playerList"][uuid]) return;

        // if the one exiting is the last one, destroy the room
        if(Object.keys(rooms[room]["playerList"]).length === 1) delete rooms[room];
        // otherwise simply leave the room
        else{

            if(rooms[room]["roomMaster"] === uuid){
                rooms[room]["roomMaster"] = rooms[room]["playerList"][Object.keys(rooms[room]["playerList"])[1]].uuid;
            }

            delete rooms[room]["playerList"][uuid];
        }

        broadcasting(room,updatePlayerList(room));
    };

    console.log(`${uuid} connected`);

    ws.on('message', (data) => {
        // console.log(`Received message => ${data}`)
        const jsonData = JSON.parse(data);

        const { meta, room, userName, senderUuid, key, value, time, answer, isDraw  } = jsonData;

        if(meta === "join") {
            if(! rooms[room]){
                rooms[room] = {
                    roomMaster: "",
                    playing: false,
                    roundTime: 0,
                    isDraw: false,
                    currentRound: 0,
                    playerList: {}
                }; // create the room
            }

            if(! rooms[room]["playerList"][uuid]){
                // join the room
                //rooms[room][uuid] = ws;
                
                if(Object.keys(rooms[room]["playerList"]).length === 0){
                    rooms[room]["roomMaster"] = uuid;
                }

                rooms[room]["playerList"][uuid] = 
                    {
                        uuid: uuid,
                        playerName: userName,
                        socket: ws,
                        ready: false,
                        completed: false,
                        answerList: []
                    };
            }
            broadcasting(room,updatePlayerList(room));
        }
        else if(meta === "leave") {
            leave(room);
        }
        else if(meta === "ready"){
            updateStatus(room, senderUuid, key, value);
        }
        else if(meta === "start"){

            if(rooms[room].roomMaster !== senderUuid){
                // not room master click
                const alertBroadcast = {
                    action: 'error',
                    message: 'No Room Master'
                };
                broadcasting(room, alertBroadcast);

            }else{
                const roundTimeArr = ["30", "60", "90", "120", "150", "180", "210", "240", "270", "300"];
                if(!roundTimeArr.includes(time)){
                    time = "30";
                }

                rooms[room]["isDraw"] = Object.keys(rooms[room]["playerList"]).length % 2 == 0;
                rooms[room]["playing"] = true;
                rooms[room]["roundTime"] = time;
                
                assignQuestionToPlayer(room);

                const startBroadcast = {
                    action: 'play',
                    room: rooms[room]
                }
                broadcasting(room, startBroadcast);
            }

        }else if(meta === "submit"){

            const nextPlayerIndex = findNextPlayerIndex(room, uuid);
            const nextPlayerUuid = Object.keys(rooms[room]["playerList"])[nextPlayerIndex];
            // rooms[room]["playerList"][nextPlayerUuid]["answerList"].
			const senderName = rooms[room]["playerList"][senderUuid]["playerName"];
            submitAnswerToPlayer(room, nextPlayerUuid, senderName, answer, isDraw);
            rooms[room]["playerList"][senderUuid]["completed"] = true;
            if(checkAllPlayerComplete(room)){
                rooms[room]["currentRound"] += 1;
                if(checkEndGame(room)){
                    const nextRoundBroadcast = {
                        action: 'endGame',
                        room: rooms[room]
                    }
                    broadcasting(room, nextRoundBroadcast);

                }else{
                    rooms[room]["isDraw"] = !rooms[room]["isDraw"]
                    resetAllPlayerCompleteStatus(room);
                    const nextRoundBroadcast = {
                        action: 'nextRound',
                        room: rooms[room]
                    }
                    broadcasting(room, nextRoundBroadcast);
                }
            }

        }
        else if(! meta) {
            // send the message to all in the room
            Object.entries(rooms[room]).forEach(([, ws]) => ws.send({ uid: uuid }));
        }

    })

    ws.on('close', function close() {
        console.log(`${uuid} disconnected`);
        Object.keys(rooms).forEach(room => {
            leave(room);
            broadcasting(room,updatePlayerList(room));
        });
    });

})
