import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import storage from 'electron-json-storage'
import { parse } from '../lib/timeParser'
import moment from 'moment'

moment.locale('en')

const History = () => {
    const [history, setHistory] = useState([])
    useEffect(() => {
        storage.get('history', (err, history) => {
            if (!err && history && history instanceof Array) 
                setHistory(history.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1))
        })
    }, [])

    return (
        <Container>
            {history && history.map(game => (
                <Match className={game.won ? 'victory' : 'defeat'} key={game.timestamp}>
                    <div className="result">{game.won ? 'Victory' : 'Defeat'}</div>
                    {//<div>{game.deck}</div>
                    }
                    <div className="time">{parse(game.duration)}</div>
                    <div className="opponent">vs {game.opponentName || 'n/a'}</div>
                    <div className="date">{moment(game.timestamp).format('MMMM DD, YYYY - hh:mm A')}</div>
            </Match>))}
        </Container>
    )
}

export default hot(module)(History)

const Container = styled.div`
    height: fill-available;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
`
const Match = styled.div`
    width: 320px;
    height: 120px;
    &.victory { background-color: green }
    &.defeat { background-color: red }
    margin-bottom: 36px;
    display: grid;
    grid-template-areas: ". . result . ."
                         ". . time . ."
                         ". . opponent . ."
                         ". . date . ."
                         "rl1 rl2 . ro1 ro2";
    grid-template-columns: 40px 40px 160px 40px 40px;
    grid-template-rows: 30px 20px 20px 20px 30px;
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }
    .result { 
        grid-area: result;
        font-size: 18px;
        text-transform: uppercase;
        font-weight: bold;
    }
    .opponent { grid-area: opponent }
    .time { grid-area: time }
    .date { grid-area: date }
`
