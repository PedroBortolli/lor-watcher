import { DeckEncoder } from 'runeterra'

export const getDeckCards = deckCode => DeckEncoder.decode(deckCode)
