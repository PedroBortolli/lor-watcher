import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import useInterval from '../hooks/useInterval'
import { searchGame } from '../api/api'

const SEARCH_FREQUENCY = 3000

const Home = () => {
    const [game, setGame] = useState({ found: false, data: {} })

    useInterval(() => {
        const search = async () => {
            console.log('searching for game')
            const gameData = await searchGame()
            if (gameData.ok) setGameActive(isGameActive)
            if (isGameActive) setGame({ found: true, data: gameData })
        }
        search()
    }, game.found ? null : SEARCH_FREQUENCY)

    return (
        <Container>
            {game.found ?
                <p>{game.data.PlayerName} vs {game.data.OpponentName}</p>
                :
                <p>Leave this screen open as you search for a match. Once the game starts your data will be automatically shown here</p>
            }
        </Container>
    )
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
