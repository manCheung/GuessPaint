import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import {NotFound} from './Pages/NotFound';
import Home from './Pages/Home';
import Room from './Pages/Room/Room';
import Play from './Pages/Play/Play';
import Review from './Pages/Review/Review';

function App(prop){
    const {socket} = prop;
    return (
        <Router>
            <Switch>
                <Route exact path="/room">
                    <Room />
                </Route>
                <Route exact path="/play">
                    <Play />
                </Route>
                <Route exact path="/review">
                    <Review />
                </Route>
                <Route exact path="/">
                    <Home 
                        socket = {socket}
                    />
                </Route>

                <Route component={NotFound} />

            </Switch>
        </Router>
    );
}

export default App;
