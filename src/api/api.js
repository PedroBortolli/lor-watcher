import axios from 'axios'

const searchGame = async () => {
    const response = await axios.get('http://localhost:21337/positional-rectangles')
    const data = await response.json()
    if (data.PlayerName) return { ok: true, data }
    return { ok: false }
}

export { searchGame }
