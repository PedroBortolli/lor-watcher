import axios from 'axios'

const searchGame = async () => {
    const response = await axios.get('http://localhost:21337/positional-rectangles')
    if (response.data.PlayerName) return { ok: true, data: response.data }
    return { ok: false }
}

export { searchGame }
