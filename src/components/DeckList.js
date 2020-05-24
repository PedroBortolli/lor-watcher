import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import { getDeckCards } from '../lib/local'

const DeckList = ({ deckCode, cardsDrawn, cardsSet }) => {
    const [deck, setDeck] = useState({ cards: [], backgrounds: {} })

    useEffect(() => {
        const staticDeck = getDeckCards(deckCode)
        let imgs = {}
        setDeck({cards: staticDeck.reduce((tot, card) => {
            let seen = 0
            cardsDrawn.forEach(cardDrawn => {
                if (cardDrawn.code === card.code) seen++
            })
            const count = card.count - seen
            if (count > 0) {
                const cardInfo = cardsSet.find(c => c.cardCode === card.code)
                if (cardInfo) {
                    tot.push({ count, name: cardInfo.name, code: cardInfo.cardCode, cost: cardInfo.cost })
                    imgs[cardInfo.cardCode] = require(`../assets/${cardInfo.cardCode}.jpg`)
                }
            }
            return tot
        }, []).sort((a, b) => a.cost < b.cost ? -1 : 1), backgrounds: imgs} )
    }, [cardsDrawn, cardsSet])

    return useMemo(() => (
        <Container>
            {deck.cards.map(card => (
                <Card key={card.name}>
                    <img src={deck.backgrounds[card.code].default} />
                    <span className="cost">{card.cost}</span>
                    <span className="name">{`${card.name.substr(0, 22)}${card.name.length > 22 ? '...' : ''}`}</span>
                    <span className="count">x{card.count}</span>
                </Card>
            ))}
        </Container>
    ), [deck])
}

export default hot(module)(DeckList)

const Container = styled.div`
    width: 296px;
    margin: 16px 16px 36px 16px;
    overflow: auto;
    ::-webkit-scrollbar { display: none }
`
const Card = styled.div`
    display: flex;
    align-items: center;
    font-size: 20px;
    width: 292px;
    height: 30px;
    padding: 4px 0;
    user-select: none;
    margin-bottom: 2px;
    > span { 
        position: absolute;
        color: white;
        text-shadow: #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px;
        -webkit-font-smoothing: antialiased;
    }
    .cost {
        border: 1.5px solid rgba(219, 214, 147, 0.75);
        border-radius: 1000px;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(#072042, #0e5375);
        position: relative;
        left: -224px;
        min-width: 32px;
    }
    .name {
        position: relative;
        left: -218px;
        font-size: 18px;
        overflow: hidden;
        white-space: nowrap;
        font-weight: bold;
        min-width: 200px;
        display: block;
    }
    .count {
        position: relative;
        left: -206px;
    }
    > img {
        position: relative;
        left: 22px;
        width: 230px;
        min-width: 230px;
        height: 30px;
        opacity: 0.7;
        border: 1.5px solid #dbd693;
        border-radius: 4px;
    }
`
