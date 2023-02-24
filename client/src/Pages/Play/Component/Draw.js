import React, { useEffect, useRef } from 'react';

export const Draw = (prop) => {

    const {uuid, room, isComplete} = prop;

    console.log(isComplete)
    let canvas, ctx, colors;
    const answerList = room["playerList"][uuid].answerList;
    const question = answerList[answerList.length - 1].answer;

    const minuteEle = useRef();
    const secondEle = useRef();

    useEffect(() => {

        initCanvas();

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

    }, [minuteEle, secondEle]);

    if(isComplete){
        console.log("lalal")
    }

    const initCanvas = () => {
        //Create canvas
        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext("2d");

        //Set background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const Lines = () => {
            //painting = false;
          
            //Initialize mouse coordinates to 0,0
            let mouse = { x: 0, y: 0 };
          
            //Paint includes line width, line cap, and color
            const paint = function () {
                ctx.lineTo(mouse.x, mouse.y);
                ctx.lineWidth = 1;
                ctx.lineJoin = "round";
                //ctx.strokeStyle = colors;
                ctx.stroke();
            };
          
            //Find mouse coordinates relative to canvas
            const linesMousemove = function (e) {
                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
            };
          
            //User clicks down on canvas to trigger paint
            const linesMousedown = function () {
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                if(!isComplete){
                    canvas.addEventListener("mousemove", paint, false);
                }
            };
          
            //When mouse lifts up, line stops painting
            const linesMouseup = function () {
                canvas.removeEventListener("mousemove", paint, false);
            };
          
            //When mouse leaves canvas, line stops painting
            const linesMouseout = function () {
                canvas.removeEventListener("mousemove", paint, false);
            };
          
            //Event listeners that will trigger the paint functions when
            //mousedown, mousemove, mouseup, mouseout
            console.log("not remove");
            canvas.addEventListener("mousedown", linesMousedown, false);
            canvas.addEventListener("mousemove", linesMousemove, false);
            canvas.addEventListener("mouseup", linesMouseup, false);
            canvas.addEventListener("mouseout", linesMouseout, false);
        }
        Lines();
    }

    const Erase = () => {
        if(isComplete) return;
        const canvas = document.getElementById("myCanvas");
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }

    const ChangeColors = (palette) => {
        //console.log(palette);
        
        switch (palette.target.id) {
            case "red":
                colors = "red";
                break;
            case "red1":
                colors = "#F16161";
                break;
            case "red2":
                colors = "#F69FA0";
                break;
            case "orange":
                colors = "orange";
                break;
            case "orange1":
                colors = "#F99F62";
                break;
            case "orange2":
                colors = "#FBB57B";
                break;
            case "blue":
                colors = "#09C2DB";
                break;
            case "blue1":
                colors = "#8BD3DC";
                break;
            case "blue2":
                colors = "#B9E3E8";
                break;
            case "indigo":
                colors = "#0E38AD";
                break;
            case "indigo1":
                colors = "#546AB2";
                break;
            case "indigo2":
                colors = "#9C96C9";
                break;
            case "green":
                colors = "green";
                break;
            case "green1":
                colors = "#97CD7E";
                break;
            case "green2":
                colors = "#C6E2BB";
                break;
            case "black":
                colors = "black";
                break;
            case "black1":
                colors = "#545454";
                break;
            case "black2":
                colors = "#B2B2B2";
                break;
            case "yellow":
                colors = "yellow";
                break;
            case "yellow1":
                colors = "#F7F754";
                break;
            case "yellow2":
                colors = "#F7F4B1";
                break;
            case "purple":
                colors = "#B9509E";
                break;
            case "purple1":
                colors = "#D178B1";
                break;
            case "purple2":
                colors = "#E3ABCE";
                break;
            case "erase":
                colors = "white";
                break;
        }
        const canvas = document.getElementById("myCanvas");
        canvas.getContext("2d").strokeStyle = colors;
    }

    /*
    const Timer = (duration) => {
        let timer = duration;
        setInterval(function () {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            
            console.log(minuteEle);
            minuteEle.current.innerText = minutes;
            secondEle.current.innerText = seconds;
            //setDrawtMinutes(minutes)
            //setDrawSeconds(seconds)
    
            if (--timer <= 0) {
                timer = 0;
            }
        }, 1000);
    
    }
    */

    return (
        <div>
            <section id="countdown">
                <ul>
                    <li><span ref={minuteEle} id="minutes"></span>Minutes</li>
                    <li><span ref={secondEle} id="seconds"></span>Seconds</li>
                </ul>
            </section>
            <section id="word" className="nes-container is-rounded is-dark">
                <p>{question}</p>
            </section>
            <section className="nes-container with-title" id="colorpanel">
                <h3 className="title">Colors</h3>
                <div id="contain">
                    <div className="palette red" id="red" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette red1" id="red1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette red2" id="red2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette orange" id="orange" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette orange1" id="orange1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette orange2" id="orange2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette yellow" id="yellow" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette yellow1" id="yellow1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette yellow2" id="yellow2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette green" id="green" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette green1" id="green1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette green2" id="green2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette blue" id="blue" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette blue1" id="blue1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette blue2" id="blue2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette indigo" id="indigo" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette indigo1" id="indigo1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette indigo2" id="indigo2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette purple" id="purple" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette purple1" id="purple1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette purple2" id="purple2" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette black" id="black" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette black1" id="black1" onClick={ChangeColors.bind(this)}></div>
                    <div className="palette black2" id="black2" onClick={ChangeColors.bind(this)}></div>
                </div>
                <div id="erasing">
                    <div className="center">
                        <div className="divText">Eraser</div>
                    </div>
                </div>
                <div className="palette white" id="erase" onClick={ChangeColors.bind(this)}></div>
            </section>
            <section id="canvasarea">
                <canvas id="myCanvas" width="852" height="497.7">
                    Canvas not supporeted in IE 8 and earlier versions srry
                </canvas>
            </section>
            <section id="space">
                <button className="nes-btn is-error" onClick={Erase}>CLEAR</button>
            </section>
        </div>
    );
};