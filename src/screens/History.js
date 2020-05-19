import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import storage from 'electron-json-storage'

const History = () => {
    const [history, setHistory] = useState([])
    useEffect(() => {
        storage.get('history', (err, history) => {
            if (!err) setHistory(history)
        })
    })

    return (
        <div>
            {history.map(game => <div style={{marginBottom: 36}}>
                <div>{game.won ? 'Victory' : 'Defeat'}</div>
                <div>{game.deck}</div>
                <div>{game.duration} seconds</div>
                <div>{`${new Date(game.timestamp)}`}</div>
            </div>)}
        </div>
    )
}

export default hot(module)(History)
