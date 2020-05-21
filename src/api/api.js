import axios from 'axios'
import { cards } from '../lib/cards'

const URL = 'http://761093b8.ngrok.io'

const getGame = async () => {
    const response = await axios.get(`${URL}/positional-rectangles`)
    if (response.data.PlayerName) return { ok: true, data: response.data }
    return { ok: false }
}

const getResult = async () => {
    const response = await axios.get(`${URL}/game-result`)
    return response
}

const getDeck = async () => {
    const response = await axios.get(`${URL}/static-decklist`)
    return response
}

const getCards = async () => {
    const response = await axios.get('https://lorassets.switchblade.xyz/en_us/data/cards.json')
    if (response.status !== 200) return cards // fallback if lorassets isn't available - may be outdated
    return response.data
}

export { getGame, getResult, getDeck, getCards }
