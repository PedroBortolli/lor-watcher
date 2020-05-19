import React from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { getDeckCards } from '../lib/local'

const DeckList = ({ deckCode, cardsDrawn, cardsSet }) => {
    const deck = getDeckCards(deckCode)

    let cardsRemaining = 0
    const remainingDeck = deck.reduce((tot, card) => {
        let seen = 0
        cardsDrawn.forEach(cardDrawn => {
            if (cardDrawn.code === card.code) seen++
        })
        const count = card.count - seen
        if (count > 0) {
            cardsRemaining += count
            const cardInfo = cardsSet.find(c => c.cardCode === card.code)
            console.log(cardInfo)
            tot.push({ count, name: cardInfo.name, code: cardInfo.cardCode, cost: cardInfo.cost })
        }
        return tot
    }, [])

    console.log(cardsRemaining, remainingDeck)

    return (
        <div>
            {remainingDeck.map(card => (
                <div>
                    <span>{card.name}</span> &nbsp; &nbsp; 
                    <span>x{card.count}</span> &nbsp; &nbsp; &nbsp; &nbsp; 
                    <span>{card.cost}</span>
                </div>
            ))}
        </div>
    )
}

export default hot(module)(DeckList)
