function getCoinsDataByIds(ids) {
    console.log(`hello from GCDBI ${ids}`)
    let filtered_coins = []

    filtered_coins = current_coins_data.filter(coin => {
        if (coin.id === undefined) {
            console.error(`Invalid id for coin: ${coin}`);
            return false;
        }
        return ids.includes(parseInt(coin.id));
    });
    console.log(filtered_coins)
    return filtered_coins

}
