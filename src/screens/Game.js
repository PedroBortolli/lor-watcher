import React from 'react'
import styled from 'styled-components'
import DeckList from '../components/DeckList'
import { hot } from 'react-hot-loader'
import { parse } from '../lib/timeParser'

const Game = ({ data, timeElapsed, localDeck, localCards, cardsSet }) => {
    const gameTime = parse(timeElapsed)
    return <Column>
        <Info>
            <span>{gameTime}</span>
            <Players>
                <span>{data.PlayerName}</span>
                <span>vs</span>
                <span>{data.OpponentName}</span>
            </Players>
        </Info>
        {localDeck && cardsSet && <DeckList deckCode={localDeck} cardsDrawn={localCards} cardsSet={cardsSet} />}
    </Column>
}

export default hot(module)(Game)

const Column = styled.div`
    display: flex;
    width: 100%;
    position: fixed;
    top: 33.5px;
    flex-direction: column;
    align-items: center;
    padding-top: 8px;
    height: fill-available;
`
const Info = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    user-select: none;
`
const Players = styled.div`
    display: flex;
    font-size: 18px;
    > span:nth-child(2) { margin: 0 6px }
`
