import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getResult, getCards, getGame } from '../api/api'
import useInterval from '../hooks/useInterval'
import { UPDATE_FREQUENCY } from '../lib/constants'
import { withRouter } from 'react-router-dom'

const Game = (props) => {
    const [gameId, setGameId] = useState(-100000)
    const [timeElapsed, updateTime] = useState(0) // time elapsed of a game in seconds
    const [gameActive, setGameActive] = useState(true)
    const [cardsSet, setCardsSet] = useState([])
    const [localCards, setLocalCards] = useState([])
    const [opponentCards, setOpponentCards] = useState([])
    const data = props.location.state.data

    useEffect(() => {
        const getGameID = async () => {
            const previousGame = await getResult()
            setGameId(Number(previousGame.data.GameID) + 1)
        }
        const getSet = async () => {
            const cards = await getCards()
            setCardsSet(cards)
        }
        getGameID()
        getSet()
    }, [])

    useInterval(() => updateTime(prevTime => prevTime + 1), 1000)
    useInterval(() => {
        const getGameResult = async () => {
            const result = await getResult()
            if (gameId > -1 && result.data.GameID === gameId) {
                // game finished - TODO: persist result
                console.log('Game finished: ', result.data)
                setGameActive(false)
            }
        }
        const updateCards = async () => {
            const result = await getGame()
            const currentCards = result.data.Rectangles
            currentCards.forEach(card => {
                if (card.CardCode !== 'face') {
                    if (card.LocalPlayer) {
                        const found = localCards.find(localCard => localCard.id === card.CardID)
                        if (!found) setLocalCards([...localCards, { id: card.CardID, code: card.CardCode }])
                    }
                    else {
                        if (!opponentCards.find(opponentCard => opponentCard.id === card.CardID))
                        setOpponentCards([...opponentCards, { id: card.CardID, code: card.CardCode }])
                    }
                }
            })
        }
        getGameResult()
        updateCards()
    }, UPDATE_FREQUENCY)


    const minutesElapsed = Math.floor(timeElapsed / 60)
    const secondsElapsed = timeElapsed % 60
    const gameTime = `${minutesElapsed > 9 ? '' : '0'}${minutesElapsed}:${secondsElapsed > 9 ? '' : '0'}${secondsElapsed}`

    return gameActive ?
        <Column>
            <div>{gameTime}</div>
            <div>{data.PlayerName}</div>
            <div>vs</div>
            <div>{data.OpponentName}</div>
        </Column>
        :
    <Redirect to="/home" />
}

export default withRouter(Game)

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
