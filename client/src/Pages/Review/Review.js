import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation, Redirect } from "react-router-dom";
import {Header} from '../Header';

export const Review = () => {

    const { socket, room, uuid, roomPwd } = useLocation();
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);

    console.log(room)

    useEffect(() => {
        if (typeof(room) === "undefined")
            setRedirect(true);
     }, []);

    if (redirect) {
        return (<Redirect to="/" />);
    }

    return(
        <div className="container">
            <Header />
            <div>Review</div>

            {
                typeof(room) !== "undefined" ?
                Object.entries(room["detail"]["playerList"]).map((player, index) => {
                    return (
                        <section className="nes-container">
                            <section className="message-list">

                                {
                                    player[1].answerList.map((answerInfo, index) => {
                                        return(

                                            index === 0 ? 
                                            <section className="review-question topic">
                                                <h2>{answerInfo.answer}</h2>
                                            </section> :

                                            index % 2 !== 0 ? 
                                                <section class="message -left">
                                                    <div className="nes-bcrikko player-name">{answerInfo.sender}</div>
                                                    <div class="nes-balloon from-left">
                                                    {
                                                        answerInfo.isDraw ?
                                                        <img className="review-img" src={answerInfo.answer} /> :
                                                        <p>{answerInfo.answer}</p>
                                                    }
                                                    </div>
                                                </section> : 
                                                <section class="message -right">
                                                    <div class="nes-balloon from-right">
                                                    {
                                                        answerInfo.isDraw ?
                                                        <img className="review-img" src={answerInfo.answer} /> :
                                                        <p>{answerInfo.answer}</p>
                                                    }
                                                    </div>
                                                    <div className="nes-bcrikko player-name">{answerInfo.sender}</div>
                                                </section>
                                        )
                                   
                                    })
                                }
                            </section>
                        </section>
                    )

                }) : ""
            }

        </div>
    );

}

export default Review;