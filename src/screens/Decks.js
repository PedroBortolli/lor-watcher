import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import storage from 'electron-json-storage'
import { getRegionsChampions } from '../lib/deck'
import { getDeckCards } from '../lib/local'
import { getCards } from '../api/api'

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
            {orderedRecords.length > 0 && cardsSet.length > 0 && orderedRecords.map(record => {
                if (record.code) {
                    const [regions, champions] = getRegionsChampions(getDeckCards(record.code), cardsSet)
                    //console.log(regions, champions)
                    return <Card>
                        <div>{record.code.substr(0, 10) + '...'}</div>
                        <div>{record.wins}/{record.losses}</div>
                        <div>{regions.map(region => <span>{region}</span>)}</div>
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
    border: 2px solid #132b66;
    border-radius: 4px;
    width: fill-available;
    margin: 0 8px 32px;
`
