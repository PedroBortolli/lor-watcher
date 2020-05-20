import React from 'react'
import ReactDOM from 'react-dom'
import Home from './screens/Home'
import Decks from './screens/Decks'
import Game from './screens/Game'
import History from './screens/History'
import { HashRouter as Router, Switch, Route, Link, browserHistory } from 'react-router-dom'
import styled from 'styled-components'

const App = () => <>
    <NavBar>
        <Router history={browserHistory}>
            <Link to="/">Home</Link>
            <Link to="/decks">Decks</Link>
            <Link to="/history">History</Link>
        </Router>
    </NavBar>
    <Container>
        <Router history={browserHistory}>
            <Switch>
                <Route path="/decks">
                    <Decks />
                </Route>
                <Route path="/game">
                    <Game />
                </Route>
                <Route path="/history">
                    <History />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    </Container>
</>

const NavBar = styled.div`
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    user-select: none;
    background-color: #132b66;
    border-bottom: 1.5px solid black;
    > a {
       :not(:last-child) { margin-right: 24px }
        color: white;
        font-size: 18px;
        text-decoration: none;
        text-shadow: #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px;
    }
`
const Container = styled.div`
    background-color: #042b40;
    height: calc(100% - 33.5px);
`

ReactDOM.render(<App />, document.getElementById('root'))
