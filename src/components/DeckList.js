import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { getDeckCards } from '../lib/local'

const DeckList = ({ deckCode, cardsDrawn, cardsSet }) => {
    const [deck, setDeck] = useState([])

    useEffect(() => {
        const staticDeck = getDeckCards(deckCode)
        setDeck(staticDeck.reduce((tot, card) => {
            let seen = 0
            cardsDrawn.forEach(cardDrawn => {
                if (cardDrawn.code === card.code) seen++
            })
            const count = card.count - seen
            if (count > 0) {
                const cardInfo = cardsSet.find(c => c.cardCode === card.code)
                if (cardInfo) tot.push({ count, name: cardInfo.name, code: cardInfo.cardCode, cost: cardInfo.cost })
            }
            return tot
        }, []).sort((a, b) => a.cost < b.cost ? -1 : 1) )
    }, [cardsDrawn, cardsSet])

    return useMemo(() => (
        <Container>
            {deck.map(card => (
                <Card key={card.name}>
                    <div>
                        <span>{card.cost}</span>
                        <span>{card.name}</span>
                    </div>
                    <span>x{card.count}</span>
                </Card>
            ))}
        </Container>
    ), [deck])
}

export default hot(module)(DeckList)

const Container = styled.div`
    width: fill-available;
    margin: 16px;
`
const Card = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    > div:first-child {
        > span:first-child { margin-right: 8px }
    }
    padding: 4px 0;
`
