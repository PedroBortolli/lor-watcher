import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import storage from 'electron-json-storage'
import { getRegionsChampions } from '../lib/deck'
import { getDeckCards } from '../lib/local'
import { getCards } from '../api/api'
import { renderIcon } from '../components/RegionIcon'
import pencil from '../assets/pencil.png'
import copy from '../assets/copy.png'
import tick from '../assets/tick.png'
import close from '../assets/close.png'

const Decks = () => {
    const [orderedRecords, setRecords] = useState([])
    const [cardsSet, setCardsSet] = useState([])
    const [customDeckNames, setCustomDeckNames] = useState({})
    const [deckName, setDeckName] = useState({ edit: false, input: '', lastCode: '', lastCustom: '' })
    useEffect(() => {
        const getSet = async () => {
            const cards = await getCards()
            setCardsSet(cards)
        }
        storage.get('history', (err, history) => {
            if (!err && history && history instanceof Array) {
                let records = {}
                history.forEach(match => {
                    if (match.deck in records) records[match.deck][match.won ? 'wins' : 'losses']++
                    else records[match.deck] = { wins: match.won ? 1 : 0, losses: match.won ? 0 : 1}
                })
                setRecords(Object.keys(records).reduce((tot, current) => {
                    tot.push({...records[current], code: current})
                    return tot
                }, []).sort((a, b) => a.wins < b.wins ? 1 : -1))
            }
            getSet()
        })
        storage.get('decknames', (err, names) => {
            if (!err) setCustomDeckNames(names)
        })
    }, [])

    const saveNewName = (deckCode) => {
        storage.get('decknames', (err, names) => {
            console.log('saving deck code', deckCode, 'to ', deckName.input)
            if (!err) {
                const newJson = {...names, [deckCode]: deckName.input}
                storage.set('decknames', newJson, e => setDeckName({edit: false, input: '', lastCode: deckCode, lastCustom: deckName.input}))
            }
            else setDeckName({edit: false, input: '', lastCode: '', lastCustom: ''})
        })
    }

    const getCustomDeckName = deckCode => {
        if (deckName.lastCode === deckCode && deckName.lastCustom) return deckName.lastCustom
        if (deckCode in customDeckNames) return customDeckNames[deckCode]
        return `${deckCode.substr(0, 15)}...`
    }

    return (
        <Container>
            <h2>Decks</h2>
            {orderedRecords.length > 0 && cardsSet.length > 0 && orderedRecords.map(record => {
                if (record.code) {
                    const [regions, champions] = getRegionsChampions(getDeckCards(record.code), cardsSet)
                    return <Card key={record.code}>
                        <div className="name">
                            <span className="title">{getCustomDeckName(record.code)}</span>
                            <div className="edit" style={{display: deckName.edit ? 'none' : 'block'}}>
                                <img src={copy} title="Copy deck code to clipboard" onClick={() => navigator.clipboard.writeText(record.code)} />
                                <img src={pencil} title="Edit deck name" onClick={() => setDeckName({...deckName, edit: true, input: ''})} />
                            </div>
                            {deckName.edit && <div className="manual">
                                <input placeholder="Deck's new name" onChange={e => setDeckName({...deckName, edit: true, input: e.target.value})} onKeyDown={e => e.key === 'Enter' ? saveNewName(record.code) : ''} />
                                <div className="buttons">
                                    <img src={tick} onClick={() => saveNewName(record.code)} />
                                    <img src={close} onClick={() => setDeckName({edit: false, input: '', lastCode: '', lastCustom: ''})} />
                                </div>
                            </div>}
                        </div>
                        <div className="winrate">
                            <span>W-L:</span>
                            <span>{record.wins}-{record.losses}</span>
                            <span>({Number(record.wins / (record.wins + record.losses) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="regions">{regions.map(region => renderIcon(region))}</div>
                    </Card>
                }
                return null
            })}
        </Container>
    )
}

export default hot(module)(Decks)

const Container = styled.div`
    height: fill-available;
    width: 100%;
    position: fixed;
    top: 33.5px;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
`
const Card = styled.div`
    background-color: #132b66;
    border: 2px solid #132b66;
    border-radius: 4px;
    width: 300px;
    margin: 0 10px 32px;
    display: grid;
    grid-template-areas: "name regions"
                         "winrate regions";
    grid-template-columns: 200px 100px;
    grid-template-rows: 32px 32px;
    .name {
        grid-area: name;
        display: flex;
        align-items: flex-start;
        padding-top: 8px;
        padding-left: 16px;
        min-width: 200px;
        width: 200px;
        .title {
            opacity: 1;
            transition: 0.3s all;
            user-select: none;
            min-width: 180px;
            width: 180px;
        }
        .edit {
            position: relative;
            left: -120px;
            top: -4px;
            width: 120px;
            min-width: 120px;
            height: 18px;
            min-height: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: 0.3s all;
            > img {
                width: 20px;
                height: 20px;
                border: 1px solid #09acd9;
                border-radius: 100px;
                background-color: #09acd9;
                padding: 4px;
                cursor: pointer;
                :not(:last-child) { margin-right: 16px }
            }
        }
        :hover {
            .title { opacity: 0.5 }
            .edit { opacity: 0.9 }
        }
        > .manual {
            position: relative;
            left: -180px;
            width: 190px;
            min-width: 190px;
            z-index: 9998;
            display: flex;
            align-items: center;
            > input {
                width: 130px;
                min-width: 130px;
                height: 20px;
                border-radius: 4px;
                background-color: rgb(19, 43, 102);
                color: white;
                font-size: 16px;
                padding: 0 4px;
            }
            .buttons {
                display: flex;
                align-items: center;
                padding-left: 6px;
                background-color: rgb(19, 43, 102);
                > img {
                    cursor: pointer;
                    width: 18px;
                    height: 18px;
                    :not(:last-child) { margin-right: 4px }
                }
            }
        }
    }
    .winrate {
        grid-area: winrate;
        display: flex;
        align-items: flex-end;
        padding-left: 16px;
        padding-bottom: 8px;
        font-size: 14px;
        > :nth-child(1) { font-style: italic }
        > :nth-child(2) {
            margin: 0 8px;
            font-weight: bold;
        }
        > :nth-child(3) { }
    }
    .regions {
        grid-area: regions;
        position: relative;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 16px;
        right: 0px;
        > img {
            width: 36px;
            height: 36px;
        }
    }
`
