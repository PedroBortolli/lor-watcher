import axios from 'axios'

const searchGame = async () => {
    const data = await fetch('url/positional-rectangles', {
        method: 'GET',
    })
    const response = await data.json()
    console.log(response)
    if (response.PlayerName) return true
    return false
    /*
    const data = await axios.get('url/positional-rectangles')
    console.log(data)
    */
    return false
}

export { searchGame }
