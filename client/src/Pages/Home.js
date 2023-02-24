import React, { useEffect } from 'react';
import {Header} from './Header';
import { useHistory } from "react-router-dom";

const Home = (prop) => {

    const {socket} = prop;
    const history = useHistory();
    let uuid = -1;

    socket.onmessage = event => {
        // console.log(event);
        if(event.data){
            try {
                const reveicedData = JSON.parse(event.data);
                console.log(reveicedData);
                if(reveicedData.action === 'uuid'){
                    uuid = reveicedData.uuid;
                }else if(reveicedData.action === 'updatePlayerList'){
                    const passwdEle = document.getElementById("room_password_field");
                    history.push({
                        pathname: '/room',
                        socket: socket,
                        roomPwd: passwdEle.value,
                        uuid: uuid,
                        room: { detail: reveicedData }
                    });
                }
            }
            catch(e){
                console.log("no json");
            }
        }
    }

    const ShowModal = () => {
        document.getElementById('create-dialog-rounded').showModal();
    }

    const Start = (e) => {
        e.preventDefault();

        const nameEle = document.getElementById("name_field");
        const passwdEle = document.getElementById("room_password_field");
        const dialogEle = document.getElementById("create-dialog-rounded");
        const emptyNameErrorEle = document.getElementById("empty_name_error_msg");
        const emptyPasswdEle = document.getElementById("empty_passwd_error_msg");

        if(nameEle.value === ""){
            nameEle.classList.add("is-error");
            emptyNameErrorEle.style.display = "block";
        }else{
            nameEle.classList.remove("is-error");
            emptyNameErrorEle.style.display = "none";
        }

        if(passwdEle.value === ""){
            passwdEle.classList.add("is-error");
            emptyPasswdEle.style.display = "block";
        }else{
            passwdEle.classList.remove("is-error");
            emptyPasswdEle.style.display = "none";
            dialogEle.close();
        }

        if(nameEle.value !== "" && passwdEle.value !== ""){
            //接收 Server 發送的訊息
            socket.send(JSON.stringify({
                meta: "join",
                room: passwdEle.value,
                userName: nameEle.value
            }));
        }
    }

    return(
        <div className="container index-container">
            <Header />
            <div className="nes-field">
                <label htmlFor="name_field">YOUR NAME</label>
                <input type="text" id="name_field" className="nes-input" placeholder="YOUR NAME" defaultValue="hello" />
                <p id="empty_name_error_msg" className="note nes-text is-error">Please Enter Your Name.</p>
            </div>
            <section className="btnwrapper">
                <button type="button" className="nes-btn" onClick={ShowModal}>CREATE / JOIN ROOM</button>
                <dialog className="nes-dialog is-rounded" id="create-dialog-rounded">
                    <form method="dialog">
                        <section className="topic"><h2>CREATE / JOIN ROOM</h2></section>
                        <div className="nes-field">
                            <label htmlFor="room_password_field">Room Password</label>
                            <input type="text" id="room_password_field" className="nes-input" placeholder="ROOM PASSWORD" defaultValue="123"/>
                            <p id="empty_passwd_error_msg" className="note nes-text is-error">Please Enter Room Password.</p>
                        </div>                          
                        <menu className="dialog-menu">
                            <button className="nes-btn">CANCEL</button>
                            <a href="#" className="nes-btn is-primary" onClick={Start}>ENTER</a>
                        </menu>
                    </form>
                </dialog>
            </section>
        </div>
    );
}

export default Home;