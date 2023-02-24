import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Redirect  } from "react-router-dom";
import {Header} from '../../Pages/Header';
import PlayerList from './Component/PlayerList'

const Room = () => {

    const { socket, room, uuid, roomPwd } = useLocation();

    const initState = {
        isAllReady: false,
        isRoomMaster: false,
    }

    const [state, setState] = useState(initState);
    const [redirect, setRedirect] = useState(false);
    const [ready, setReady] = useState(false);
    const [roomDetail, setRoomDetail] = useState(typeof(room) != "undefined" ? room.detail.list : {});
    const history = useHistory();

    useEffect(() => {

        if (typeof(room) === "undefined"){
            setRedirect(true);
        }else{
            setRoomDetail(room.detail.list);
            if(room.detail.list.roomMaster === uuid){
                setState(prevState => ({
                    ...prevState,
                    "isRoomMaster": true
                }))
            }
        }
        
    }, []);
    
    useEffect(() => {

        if (typeof(room) !== "undefined"){
            setState(prevState => ({
                ...prevState,
                "isAllReady": isAllReady(roomDetail)
            }))
        }

    }, [roomDetail]);

    if (redirect) {
        return (<Redirect to="/" />);
    }

    if(socket){
        socket.onmessage = event => {
            // console.log(event);
            if(event.data){
                try {
                    const receivedData = JSON.parse(event.data);
                    if(receivedData.action === 'error'){
                        alert('error');
                    }else if(receivedData.action === 'updatePlayerList'){
                        setRoomDetail(receivedData.list);
                    }else if(receivedData.action === 'play'){
                        history.push({
                            pathname: '/play',
                            socket: socket,
                            roomPwd: roomPwd,
                            uuid: uuid,
                            room: { detail: receivedData.room }
                        });
                    }
                }
                catch(err){
                    console.log(`Room Error: ${err.message}`);
                }
            }
        }
    }

    const isAllReady = (room) =>{
        if(Object.keys(room).length === 0) return false;
        for (const [key, value] of Object.entries(room["playerList"])) {
            if(!value.ready){
                return false;
            }
        }
        return true;
    }

    const clickReadyButton = () => {

        setReady(!ready);

        socket.send(JSON.stringify({
            meta: "ready",
            room: roomPwd,
            senderUuid: uuid,
            key: "ready",
            value: !ready
        }));
    }

    const onSortable = (evt) => {
        // console.log(onSortable)
        // console.log(evt)
    }

    const startGame = () => {

        if(!state.isAllReady) return false;

        socket.send(JSON.stringify({
            meta: "start",
            room: roomPwd,
            senderUuid: uuid,
            time: document.getElementById('select_round_time').value
        }));
    }

    return(
        <div className="container">
            <Header />
            <section id="room-setting" className="nes-container with-title">
                <h3 className="title">SETTING</h3>
                <label htmlFor="select_round_time">ROUND TIME</label>
                <div className="nes-select">
                    <select required id="select_round_time">
                        <option value="30">30 SEC</option>
                        <option value="60">1 MIN</option>
                        <option value="90">1.5 MIN</option>
                        <option value="120">2 MIN</option>
                        <option value="150">2.5 MIN</option>
                        <option value="180">3 MIN</option>
                        <option value="210">3.5 MIN</option>
                        <option value="240">4 MIN</option>
                        <option value="270">4.5 MIN</option>
                        <option value="300">5 MIN</option>
                    </select>
                </div>
            </section>
            <PlayerList 
                room={roomDetail}
                onSortable={onSortable}
            />
            <section className="btnwrapper">
                <button id="btnready" className={`nes-btn is-success ${ready ? "is-error" : "is-success"}`} onClick={clickReadyButton}>
                    {
                        ready ? "UNREADY" : "READY"
                    }
                </button>
            </section>
            {
                state.isRoomMaster ?
                    <section className="btnwrapper">
                        <button id="btnstart" className={`nes-btn ${!state.isAllReady ? "is-disabled" : ""}`} onClick={startGame}>START</button>
                    </section> : ""
            }
        </div>
    );
}

export default Room;