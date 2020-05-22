import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import storage from 'electron-json-storage'
import { parse } from '../lib/timeParser'
import moment from 'moment'
import { getRegionsChampions } from '../lib/deck'
import { getDeckCards } from '../lib/local'
import { renderIcon } from '../components/RegionIcon'
import { getCards } from '../api/api'
import swordsCrossed from '../assets/swords-crossed.png'

moment.locale('en')

const History = () => {
    const [history, setHistory] = useState([])
    const [cardsSet, setCardsSet] = useState([])
    useEffect(() => {
        const getSet = async () => {
            const cards = await getCards()
            setCardsSet(cards)
        }
        storage.get('history', (err, history) => {
            if (!err && history && history instanceof Array) {
                const foo = history.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
                setHistory([...foo, ...foo])
            }
            getSet()
        })
    }, [])

    return (
        <Container>
            <h2>Match history</h2>
            {history && cardsSet.length > 0 && history.map(game => {
                if (game && game.deck) {
                    const [localRegions, localChampions] = getRegionsChampions(getDeckCards(game.deck), cardsSet)
                    return <Match className={game.won ? 'victory' : 'defeat'} key={game.timestamp}>
                        <div className="result">{game.won ? 'Victory' : 'Defeat'}</div>
                        <div className="time" title="Match time">{parse(game.duration)}</div>
                        <div className="date">{moment(game.timestamp).format('MMMM DD, YYYY - hh:mm A')}</div>
                        <div className="rl">{localRegions.map(region => renderIcon(region))}</div>
                        <div className="ro">{game.opponentRegions.map(region => renderIcon(region))}</div>
                        <div className="local">{game.localName || 'n/a'}</div>
                        <div className="opp">{game.opponentName || 'n/a'}</div>
                        <div className="vs"><img src={swordsCrossed} /></div>
                    </Match>
                }
                else return null
            })}
        </Container>
    )
}

export default hot(module)(History)

const Container = styled.div`
    height: fill-available;
    display: flex;
    position: fixed;
    top: 33.5px;
    width: 100%;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    > h2 { font-size: 24px }
    ::-webkit-scrollbar { display: none }
`
const Match = styled.div`
    width: 320px;
    height: 150px;
    border-bottom: 1.5px solid black;
    &.victory { background-color: #187d49 }
    &.defeat { background-color: #9c0010 }
    display: grid;
    grid-template-areas: ". result result result ."
                         ". time time time ."
                         ". date date date ."
                         "local local vs opp opp"
                         "rl rl vs ro ro";
    grid-template-columns: 80px 60px 40px 60px 80px;
    grid-template-rows: 30px 20px 20px 30px 50px;
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        > img {
            width: 36px;
            height: 36px;
        }
    }
    .result { 
        grid-area: result;
        font-size: 18px;
        text-transform: uppercase;
        font-weight: bold;
        display: flex;
        align-items: flex-end;
    }
    .time { grid-area: time }
    .date { grid-area: date }
    .rl { grid-area: rl }
    .ro { grid-area: ro }
    .local {
        display: flex;
        align-items: flex-end;
        grid-area: local;
    }
    .opp {
        display: flex;
        align-items: flex-end;
        grid-area: opp;
    }
    .vs {
        grid-area: vs;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
            height: 16px;
            width: 16px;
        }
    }
`
