import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import useInterval from '../hooks/useInterval'
import { getGame } from '../api/api'
import { SEARCH_FREQUENCY } from '../lib/constants'
import Decks from './Decks'
import History from './History'
import Logo from '../assets/logo.png'
import Game from './Game'
import { parse } from '../lib/timeParser'

const Home = () => {
    const [game, setGame] = useState({ found: false, data: {} })
    const [tab, changeTab] = useState('tracker')
    const [timeElapsed, updateTime] = useState(0)

    useEffect(() => {
        if (!game.found) updateTime(0)
    }, [game])

    useInterval(() => {
        const searchGame = async () => {
            const gameData = await getGame()
            if (gameData.ok && gameData.data.Rectangles.length === 0) setGame({ found: true, data: gameData.data })
        }
        searchGame()
    }, game.found ? null : SEARCH_FREQUENCY)

    useInterval(() => updateTime(prevTime => prevTime + 1), game.found ? 1000 : null)
    const gameTime = parse(timeElapsed)

    return <>
        <NavBar>
            <img onClick={() => changeTab('tracker')} src={Logo} />
            <span onClick={() => changeTab('tracker')} className={tab === 'tracker' ? 'active' : '' }>Tracker</span>
            <span onClick={() => changeTab('decks')} className={tab === 'decks' ? 'active' : '' }>Decks</span>
            <span onClick={() => changeTab('history')} className={tab === 'history' ? 'active' : '' }>History</span>
        </NavBar>
        {game.found && tab !== 'tracker' && <Warning>
            <span>There's an ongoing match!</span>
            <span>{gameTime}</span>
        </Warning>}
        <Container>
            {tab === 'decks' ?
                <Decks />
            :
             tab === 'history' ?
                <History />
            :
             game.found ?
                <Game data={game.data} timeElapsed={timeElapsed} />
            :
                <p>
                    Leave this screen open as you search for a match. Once the game starts your data will be automatically shown here
                </p>
            }
        </Container>
    </>
}

export default hot(module)(Home)

const Container = styled.div`
    background-color: white;
    color: black;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0px 8px;
    > p {
        text-align: center;
    }
`
const NavBar = styled.div`
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 8px;
    user-select: none;
    background-color: #132b66;
    border-bottom: 1.5px solid black;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    > img {
        height: 28px;
        width: 28px;
        cursor: pointer;
    }
    > span {
        cursor: pointer;
        margin-left: 24px;
        :nth-child(2) { margin-left: 20px }
        color: white;
        font-size: 18px;
        text-decoration: none;
        text-shadow: #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px;
        transition: all 0.3s;
        :hover {
            color: #dbd693;
        }
        &.active { color: #dbd693 }
    }
`
const Warning = styled.div`
    position: absolute;
    top: 32px;
    height: 24px;
    font-size: 14px;
    width: fill-available;
    background-color: yellow;
    z-index: 999999;
    display: flex;
    align-items: center;
    padding: 0 8px;
    justify-content: space-between;
`
