export const parse = timeElapsed => {
    if (!timeElapsed) return '00:00'
    const minutesElapsed = Math.floor(timeElapsed / 60)
    const secondsElapsed = timeElapsed % 60
    return `${minutesElapsed > 9 ? '' : '0'}${minutesElapsed}:${secondsElapsed > 9 ? '' : '0'}${secondsElapsed}`
}
