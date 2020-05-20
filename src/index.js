import React from 'react'
import ReactDOM from 'react-dom'
import Home from './screens/Home'
import styled from 'styled-components'


const Container = styled.div`
    background-color: #042b40;
    height: calc(100% - 33.5px);
`

ReactDOM.render(<Container><Home /></Container>, document.getElementById('root'))
