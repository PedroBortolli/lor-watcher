import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import useInterval from '../hooks/useInterval'
import { getGame } from '../api/api'
import { SEARCH_FREQUENCY } from '../lib/constants'
import { Redirect } from 'react-router-dom'

const Home = () => {
    const [game, setGame] = useState({ found: false, data: {} })

    useInterval(() => {
        const searchGame = async () => {
            const gameData = await getGame()
            if (gameData.ok) setGame({ found: true, data: gameData.data })
        }
        searchGame()
    }, game.found ? null : SEARCH_FREQUENCY)

    return (
        <Container>
            {game.found ?
                <Redirect to={{ pathname: '/game', state: { data: game.data }}} />
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
