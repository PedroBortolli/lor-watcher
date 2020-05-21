import React from 'react'
import ReactDOM from 'react-dom'
import Home from './screens/Home'
import styled from 'styled-components'


const Container = styled.div`
    background-color: #042b40;
    height: calc(100% - 33.5px);
    width: 100%;
    position: fixed;
    top: 33.5px;
    left: 0;
`

ReactDOM.render(<Container><Home /></Container>, document.getElementById('root'))
