import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { getDeckCards } from '../lib/local'

const DeckList = ({ deckCode, cardsDrawn, cardsSet }) => {
    const [deck, setDeck] = useState([])

    useEffect(() => {
        const staticDeck = getDeckCards(deckCode)
        let cardsRemaining = 0
        setDeck(staticDeck.reduce((tot, card) => {
            let seen = 0
            cardsDrawn.forEach(cardDrawn => {
                if (cardDrawn.code === card.code) seen++
            })
            const count = card.count - seen
            if (count > 0) {
                cardsRemaining += count
                const cardInfo = cardsSet.find(c => c.cardCode === card.code)
                if (cardInfo) tot.push({ count, name: cardInfo.name, code: cardInfo.cardCode, cost: cardInfo.cost })
            }
            return tot
        }, []))
    }, [cardsDrawn, cardsSet])

    //console.log(deck)
    return useMemo(() => (
        <div>
            {console.log('criando a div aqui o')}
            {deck.map(card => (
                <div>
                    <span>{card.name}</span> &nbsp; &nbsp; 
                    <span>x{card.count}</span> &nbsp; &nbsp; &nbsp; &nbsp; 
                    <span>{card.cost}</span>
                </div>
            ))}
        </div>
    ), [deck])
}

export default hot(module)(DeckList)
