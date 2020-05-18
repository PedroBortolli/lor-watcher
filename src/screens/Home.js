import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import useInterval from '../hooks/useInterval'
import { searchGame } from '../api/api'

const SEARCH_FREQUENCY = 3000

const Home = () => {
    const [gameFound, setGameActive] = useState(false)

    useInterval(async () => {
        console.log('searching for game')
        const isGameActive = await searchGame()
        if (isGameActive) setGameActive(isGameActive)
    }, gameFound ? null : SEARCH_FREQUENCY)

    console.log('gameFound: ', gameFound)

    return (
        <Container>
            {gameFound ?
                <p>Collecting information about your ongoing match, hold tight!</p>
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
