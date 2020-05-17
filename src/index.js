import React from 'react'
import ReactDOM from 'react-dom'
import Home from './screens/Home'
import Decks from './screens/Decks'
import { HashRouter as Router, Switch, Route, Link, browserHistory } from 'react-router-dom'
import styled from 'styled-components'

const App = () => <>
    <NavBar>
        <Router history={browserHistory}>
            <Link to="/">Home</Link>
            <Link to="/decks">Decks</Link>
        </Router>
    </NavBar>
    <Container>
        <Router history={browserHistory}>
            <Switch>
                <Route path="/decks">
                    <Decks />
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
    background: #001b85;
    > a {
       :not(:last-child) { margin-right: 16px }
        color: white;
        text-decoration: none;
    }
`
const Container = styled.div`
    height: calc(100% - 32px);
`

ReactDOM.render(<App />, document.getElementById('root'))
