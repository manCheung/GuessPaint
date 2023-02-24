import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Redirect } from "react-router-dom";
import {Header} from '../Header';
import {Draw} from './Component/Draw';
import {Guess} from './Component/Guess';

const Play = () => {

    const { socket, room, uuid, roomPwd } = useLocation();

    const [isDraw, setIsDraw] = useState(typeof(room) !== "undefined" ? room.detail.isDraw : false);
    const [roomDetail, setRoomDetail] = useState(typeof(room) !== "undefined" ? room.detail : {});
    const [redirect, setRedirect] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (typeof(room) === "undefined")
            setRedirect(true);
     }, []);

    if (redirect) {
        return (<Redirect to="/" />);
    }

    if(socket){
        socket.onmessage = event => {
            //console.log(event);
            if(event.data){
                try {
                    const receivedData = JSON.parse(event.data);
                    if(receivedData.action === "nextRound"){
                        setIsComplete(false);
                        setIsDraw(receivedData.room.isDraw);
                        //roomDetail = receivedData;
                        setRoomDetail(receivedData.room);
                    }
                    else if(receivedData.action === "endGame"){
                        history.push({
                            pathname: '/review',
                            socket: socket,
                            roomPwd: roomPwd,
                            uuid: uuid,
                            room: { detail: receivedData.room }
                        });
                    }
                }
                catch(e){
                    console.log("Room: no json");
                }
            }
        }
    }

    const Complete = () => {

        if(!isComplete){
            setIsComplete(!isComplete);
            
            let ans = "";
            if(isDraw){
                const canvas = document.getElementById("myCanvas");
                ans = canvas.toDataURL("image/png");
            }else{
                ans = document.getElementById("text_answer").value;
            }
            socket.send(JSON.stringify({
                meta: "submit",
                room: roomPwd,
                answer: ans,
                isDraw: isDraw,
                senderUuid: uuid
            }));
        }
    }

    return(
        <div className="container">
            <Header />
            {
                typeof(room) !== "undefined" ?
                isDraw ? (
                    <Draw 
                        room = {roomDetail}
                        uuid = {uuid}
                        isComplete = {isComplete}
                    />
                ) : (
                    <Guess
                        room = {roomDetail}
                        uuid = {uuid}
                        isComplete = {isComplete}
                    />
                ) : ""
            }
            <section className="btnwrapper">
                <button className={`nes-btn is-success ${isComplete ? "is-disabled" : ""}`} onClick={Complete}>COMPLETE</button>
            </section>
        </div>
    );
}
    
export default Play;