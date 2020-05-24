import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import useInterval from '../hooks/useInterval'
import { getResult, getCards, getGame, getDeck } from '../api/api'
import { SEARCH_FREQUENCY, UPDATE_FREQUENCY, FINISH_FREQUENCY } from '../lib/constants'
import Decks from './Decks'
import History from './History'
import Logo from '../assets/logo.png'
import Game from './Game'
import { parse } from '../lib/timeParser'
import search from '../assets/search.png'
import { getRegionsChampions } from '../lib/deck'
import { getDeckCards } from '../lib/local'
import storage from 'electron-json-storage'

const Home = () => {
    const [game, setGame] = useState({ found: false, id: -100000, data: {} })
    const [tab, changeTab] = useState('tracker')
    const [timeElapsed, updateTime] = useState(0)
    const [cardsSet, setCardsSet] = useState([])
    const [localCards, setLocalCards] = useState([])
    const [opponentCards, setOpponentCards] = useState([])
    const [localDeck, setLocalDeck] = useState('')

    useEffect(() => {
        const getSet = async () => {
            const cards = await getCards()
            setCardsSet(cards)
        }
        getSet()
    }, [])

    useEffect(() => {
        const getLocalDeck = async () => {
            console.log('pegando deck local')
            const deck = await getDeck()
            console.log('deck encontrado = ', deck)
            setLocalDeck(deck.data.DeckCode)
        }
        if (!game.found) {
            updateTime(0)
            setLocalDeck('')
            setCardsSet([])
            setLocalCards([])
            setOpponentCards([])
        }
        else getLocalDeck()
    }, [game])

    useInterval(() => {
        const searchGame = async () => {
            const gameData = await getGame()
            if (gameData.ok && gameData.data.Rectangles.length === 0) {
                const previousGame = await getResult()
                const newGameId = Number(previousGame.data.GameID) + 1
                setGame({ found: true, id: newGameId, data: gameData.data })
            }
        }
        searchGame()
    }, game.found ? null : SEARCH_FREQUENCY)

    useInterval(() => {
        const updateCards = async () => {
            const result = await getGame()
            const currentCards = result.data.Rectangles
            let localPlayed = [], opponentPlayed = []
            currentCards.forEach(card => {
                if (card.CardCode !== 'face') {
                    if (card.LocalPlayer) {
                        if (!localCards.find(localCard => localCard.id === card.CardID) && (timeElapsed > 90 || card.TopLeftY < 105))
                            localPlayed.push({ id: card.CardID, code: card.CardCode })
                    }
                    else {
                        if (!opponentCards.find(opponentCard => opponentCard.id === card.CardID))
                            opponentPlayed.push({ id: card.CardID, code: card.CardCode })
                    }
                }
            })
            setLocalCards([...localCards, ...localPlayed])
            setOpponentCards([...opponentCards, ...opponentPlayed])
        }
        updateCards()
    }, game.found ? UPDATE_FREQUENCY : null)

    useInterval(() => {
        const getGameResult = async () => {
            const result = await getResult()
            if (game.id > -1 && result.data.GameID === game.id) {
                const [localRegions, localChampions] = getRegionsChampions(getDeckCards(localDeck), cardsSet)
                const [oppRegions, oppChampions] = getRegionsChampions(opponentCards, cardsSet)
                const gameResult = {
                    won: result.data.LocalPlayerWon,
                    deck: localDeck,
                    opponentRegions: oppRegions,
                    opponentChampions: oppChampions,
                    opponentName: game.data.OpponentName,
                    localName: game.data.PlayerName,
                    localRegions: localRegions,
                    localChampions: localChampions,
                    duration: timeElapsed,
                    timestamp: + new Date()
                }
                storage.get('history', (err, history) => {
                    console.log('saving match to history')
                    if (!err) {
                        if (history && history instanceof Array) storage.set('history', [...history, gameResult], e => {
                            setGame({ found: false, id: -1, data: {} })
                        })
                        else storage.set('history', [gameResult], e => {
                            setGame({ found: false, id: -1, data: {} })
                        })
                    }
                    else {
                        setGame({ found: false, id: -1, data: {} })
                    }
                })
            }
        }
        getGameResult()
    }, game.found ? FINISH_FREQUENCY : null)

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
                <Game data={game.data} timeElapsed={timeElapsed} localDeck={localDeck} localCards={localCards} cardsSet={cardsSet} />
            :
                <Column>
                    <img style={{width: 144, height: 144}} src={search} />
                    <p>
                        Leave the app open as you search for a match. Once the game starts the cards from your deck will be automatically shown here!
                    </p>
                    <p>
                        Feel free to navigate in the other tabs too
                    </p>
                </Column>
            }
        </Container>
    </>
}

export default hot(module)(Home)

const Container = styled.div`
    width: 100%;
    color: black;
    font-size: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
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
    position: fixed;
    top: 32px;
    height: 20px;
    font-size: 14px;
    width: fill-available;
    background-color: #ad7f00;
    z-index: 999999;
    display: flex;
    align-items: center;
    padding: 0 8px;
    justify-content: space-between;
`
const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.6;
    > img {
        filter: invert(100%);
        animation: Circles 1s linear infinite;
        position: relative;
        left: 0;
        bottom: 0;
    }
    @keyframes Circles {
        0%, 100% { bottom: 0 }
        25% { left: -10px }
        50% { bottom: 10px }
        75% { left: 10px }
    }
    > p {
        text-align: center;
        padding: 16px 16px 0;
        color: white;
    }
`
