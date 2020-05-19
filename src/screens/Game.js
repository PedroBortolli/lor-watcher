import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getResult, getCards, getGame, getDeck } from '../api/api'
import useInterval from '../hooks/useInterval'
import DeckList from '../components/DeckList'
import { UPDATE_FREQUENCY } from '../lib/constants'
import { Redirect, withRouter } from 'react-router-dom'
import storage from 'electron-json-storage'
import { getOppRegions, getOppChampions } from '../lib/opponent'
import { parse } from '../lib/timeParser'

const Game = (props) => {
    const [gameId, setGameId] = useState(-100000)
    const [timeElapsed, updateTime] = useState(0) // time elapsed of a game in seconds
    const [gameActive, setGameActive] = useState(true)
    const [cardsSet, setCardsSet] = useState([])
    const [localCards, setLocalCards] = useState([])
    const [opponentCards, setOpponentCards] = useState([])
    const [localDeck, setLocalDeck] = useState('')
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
        const getLocalDeck = async () => {
            const deck = await getDeck()
            setLocalDeck(deck.data.DeckCode)
        }
        getGameID()
        getSet()
        getLocalDeck()
    }, [])

    useInterval(() => updateTime(prevTime => prevTime + 1), 1000)
    useInterval(() => {
        const getGameResult = async () => {
            const result = await getResult()
            if (gameId > -1 && result.data.GameID === gameId) {
                const gameResult = {
                    won: result.data.LocalPlayerWon,
                    deck: localDeck,
                    opponentRegions: getOppRegions(),
                    opponentChampions: getOppChampions(),
                    duration: timeElapsed,
                    timestamp: + new Date()
                }
                storage.get('history', (err, history) => {
                    if (!err) {
                        if (history) storage.set('history', [...history, gameResult], e => setGameActive(false))
                        else storage.set('history', [gameResult], e => setGameActive(false))
                    }
                })
            }
        }
        const updateCards = async () => {
            const result = await getGame()
            const currentCards = result.data.Rectangles
            currentCards.forEach(card => {
                if (card.CardCode !== 'face') {
                    if (card.LocalPlayer) {
                        if (card.TopLeftY < 100 && !localCards.find(localCard => localCard.id === card.CardID))
                            setLocalCards([...localCards, { id: card.CardID, code: card.CardCode }])
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

    const gameTime = parse(timeElapsed)
    return gameActive ?
        <Column>
            <div>{gameTime}</div>
            <div>{data.PlayerName}</div>
            <div>vs</div>
            <div>{data.OpponentName}</div>
            {localDeck && cardsSet && <DeckList deckCode={localDeck} cardsDrawn={localCards} cardsSet={cardsSet} />}
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
