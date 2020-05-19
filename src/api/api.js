import axios from 'axios'
import { cards } from '../lib/cards'

const getGame = async () => {
    const response = await axios.get('http://b053375c.ngrok.io/positional-rectangles')
    if (response.data.PlayerName) return { ok: true, data: response.data }
    return { ok: false }
}

const getResult = async () => {
    const response = await axios.get('http://b053375c.ngrok.io/game-result')
    return response
}

const getCards = async () => {
    const response = await axios.get('https://lorassets.switchblade.xyz/en_us/data/cards.json')
    if (response.status !== 200) return cards // fallback if lorassets isn't available - may be outdated
    return response.data
}

export { getGame, getResult, getCards }
