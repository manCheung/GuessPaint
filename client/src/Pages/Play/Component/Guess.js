import React, { useEffect, useRef } from 'react';

export const Guess = (prop) => {

    const {uuid, room} = prop;

    const minuteEle = useRef();
    const secondEle = useRef();
    const paintSrcEle = useRef();

    const answerList = room["playerList"][uuid]["answerList"];
    const questionImgBase64 = answerList[answerList.length - 1].answer;

    useEffect(() => {

        paintSrcEle.current.src = findPreviousQuestion();

        let timer = room.roundTime;
        const timeCounter = setInterval(function () {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            minuteEle.current.innerText = minutes;
            secondEle.current.innerText = seconds;

            if (--timer <= 0) {
                timer = 0;
            }
        }, 1000);

        return () => {
            clearInterval(timeCounter);
        }
    }, [answerList, questionImgBase64]);

    const findPreviousQuestion = () => {

        const playerList = Object.keys(room["playerList"]);
        let index = -1;
        for(let i = 0; i < playerList.length; i++){
            let playerUuid = room["playerList"][playerList[i]].uuid;
            if(playerUuid === uuid){
                index = i - room["currentRound"];
                if(index < 0){
                    index = playerList.length - room["currentRound"];
                }
            }
        }
        
        const answerList = room["playerList"][playerList[index]]["answerList"];
        return answerList[answerList.length - 1].answer;
    }

    return (
        <div>
            <section id="countdown">
                <ul>
                    <li><span ref={minuteEle} id="minutes"></span>Minutes</li>
                    <li><span ref={secondEle} id="seconds"></span>Seconds</li>
                </ul>
            </section>
            <section id="word" className="nes-container">
                <img ref={paintSrcEle} id="paintsrc" src={questionImgBase64} />
            </section>
            <section id="answerbg">
                <div className="nes-field is-inline">
                    <input type="text" id="text_answer" className="nes-input" placeholder="YOUR ANSWER" />
                  </div>
            </section>
        </div>
    );

};
