
const randomNumberTimeBased = (key: string) => {
    const d = new Date();
    const dStart = new Date(1970, 1, 1);
    const dateDifference = ((d.getTime() - dStart.getTime()) * 100);
    if (key) {
        if (key.length > 3)
            key = key.slice(key.length - 4);
        return `${dateDifference.toString()}-${key}`;
    } else
        return dateDifference.toString();
}

export default randomNumberTimeBased;