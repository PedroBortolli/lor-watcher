import React from 'react'

import BW from '../assets/icon-bilgewater.png'
import DM from '../assets/icon-demacia.png'
import FJ from '../assets/icon-freljord.png'
import IO from '../assets/icon-ionia.png'
import NX from '../assets/icon-noxus.png'
import PZ from '../assets/icon-piltoverzaun.png'
import SI from '../assets/icon-shadowisles.png'

const map = {
    'Bilgewater': BW,
    'Demacia': DM,
    'Freljord': FJ,
    'Ionia': IO,
    'Noxus': NX,
    'Piltover & Zaun': PZ,
    'PiltoverZaun': PZ,
    'Shadow Isles': SI,
    'ShadowIsles': SI
}

export const renderIcon = region => {
    const icon = map[region]
    return icon && <img key={region} src={icon} alt={region} title={region} />
}
