export const getRegionsChampions = (cardsPlayed, set) => {
    let regions = {}, champions = {}
    cardsPlayed.forEach(cardPlayed => {
        const card = set.find(c => c.cardCode === cardPlayed.code)
        if (card) {
            regions[card.region] = true
            if (card.supertype === 'Champion') champions[card.name] = true
        }
    })

    return [Object.keys(regions), Object.keys(champions)]
}