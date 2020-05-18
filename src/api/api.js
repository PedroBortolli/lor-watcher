import axios from 'axios'

const getGame = async () => {
    const response = await axios.get('http://b053375c.ngrok.io/positional-rectangles')
    if (response.data.PlayerName) return { ok: true, data: response.data }
    return { ok: false }
}

const getResult = async () => {
    const response = await axios.get('http://b053375c.ngrok.io/game-result')
    return response
}

export { getGame, getResult }
