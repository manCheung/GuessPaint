import React from 'react';
import {  Redirect  } from "react-router-dom";

export class NotFound extends React.Component{

    render(){

        const backToHomeClick = () => {
            return (<Redirect to="/" />);
        }

        return(
            <div className="container not-found-container">
                <section className="topic">
                    <h2 className="text-404">404</h2>
                    <p className="content-404">Page Not Found</p>
                    <br></br>
                    <p className="facemood">。･ﾟ･(つд`ﾟ)･ﾟ･</p>
                    <br></br>
                    <button className="nes-btn" onClick={backToHomeClick}>
                        <a href="/" className="return-to-home">RETURN TO HOMEPAGE</a>
                    </button>
                </section>
            </div>
        );
    }
}