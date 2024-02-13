
class URLS_MANAGER {

    constructor() {
        this.MARKET_DATA_URL = 'api/v1/market_data/'
        this.MARKET_DATA_WITH_SKIP = 'api/v1/market_data/'
        this.COIN_CHART_URL = 'api/v1/charts/'
        this.GET_COIN_DATA = 'api/v1/coins/'
    }

    getMarketCapUrl(currency) {
        return this.MARKET_DATA_URL + currency
    }

    getCoinChartUrl() {
        return this.COIN_CHART_URL
    }

    getMarketCapWithSkipLimitUrl(currency) {
        return this.MARKET_DATA_WITH_SKIP + currency + '/'
    }
}




function createTable(data) {





}


function handleDataAndFillTable(data) {

    fillTable(data, 'usd')
    drawBubbles(data, 'marketcap')
    current_coins_data = data
    return data
}

function handleCoinChartData(data) {
    let content = document.getElementById('content')
    console.log(data)
    createChart(data)
}


document.addEventListener('DOMContentLoaded', function () {

    urls_manager = new URLS_MANAGER()
    follow_lists_manager = new followListsManager()

    get_coin_chart_data(handleCoinChartData, '1', 'week')
    data = get_data_with_skip_limit(handleDataAndFillTable, 'usd', 0, 100)


})
