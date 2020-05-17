import React from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'

const Home = () => {
    return (
        <Container>
            LoR Home
        </Container>
    )
}

export default hot(module)(Home)

const Container = styled.div`
    background-color: white;
    color: black;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`
