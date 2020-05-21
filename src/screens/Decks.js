import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import storage from 'electron-json-storage'
import { getRegionsChampions } from '../lib/deck'
import { getDeckCards } from '../lib/local'
import { getCards } from '../api/api'
import { renderIcon } from '../components/RegionIcon'

const Decks = () => {
    const [orderedRecords, setRecords] = useState([])
    const [cardsSet, setCardsSet] = useState([])
    useEffect(() => {
        const getSet = async () => {
            const cards = await getCards()
            setCardsSet(cards)
        }
        storage.get('history', (err, history) => {
            if (!err && history && history instanceof Array) {
                let records = {}
                history.forEach(match => {
                    if (match.deck in records) records[match.deck][match.won ? 'wins' : 'losses']++
                    else records[match.deck] = { wins: match.won ? 1 : 0, losses: match.won ? 0 : 1}
                })
                setRecords(Object.keys(records).reduce((tot, current) => {
                    tot.push({...records[current], code: current})
                    return tot
                }, []).sort((a, b) => a.wins < b.wins ? 1 : -1))
            }
            getSet()
        })
    }, [])
    return (
        <Container>
            <h2>Decks</h2>
            {orderedRecords.length > 0 && cardsSet.length > 0 && orderedRecords.map(record => {
                if (record.code) {
                    const [regions, champions] = getRegionsChampions(getDeckCards(record.code), cardsSet)
                    return <Card>
                        <div className="name">{record.code.substr(0, 15) + '...'}</div>
                        <div className="winrate">
                            <span>W-L:</span>
                            <span>{record.wins}-{record.losses}</span>
                            <span>({Number(record.wins / (record.wins + record.losses) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="regions">{regions.map(region => renderIcon(region))}</div>
                    </Card>
                }
                return null
            })}
        </Container>
    )
}

export default hot(module)(Decks)

const Container = styled.div`
    height: fill-available;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
`
const Card = styled.div`
    background-color: #132b66;
    border: 2px solid #132b66;
    border-radius: 4px;
    width: fill-available;
    margin: 0 10px 32px;
    display: grid;
    grid-template-areas: "name regions"
                         "winrate regions";
    grid-template-columns: 200px 100px;
    grid-template-rows: 32px 32px;
    .name {
        grid-area: name;
        display: flex;
        align-items: flex-start;
        padding-top: 8px;
        padding-left: 16px;
    }
    .winrate {
        grid-area: winrate;
        display: flex;
        align-items: flex-end;
        padding-left: 16px;
        padding-bottom: 8px;
        font-size: 14px;
        > :nth-child(1) { font-style: italic }
        > :nth-child(2) {
            margin: 0 8px;
            font-weight: bold;
        }
        > :nth-child(3) { }
    }
    .regions {
        grid-area: regions;
        position: relative;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 16px;
        right: 0px;
        > img {
            width: 36px;
            height: 36px;
        }
    }
`
