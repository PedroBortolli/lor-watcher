import React from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'

const Decks = () => {
    return (
        <Container>
            Decks
        </Container>
    )
}

export default hot(module)(Decks)

const Container = styled.div`
    background: #590f17;
    height: 100%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`