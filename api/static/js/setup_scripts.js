
class URLS_MANAGER {

    constructor() {
        this.MARKET_DATA_URL = 'api/v1/market_data/'
        this.MARKET_DATA_WITH_SKIP = 'api/v1/market_data/'
        this.COIN_CHART_URL = 'api/v1/charts/'
        this.GET_COIN_DATA = 'api/v1/coins/'
        this.LOGOS_URI = `{{ url_for('static', path='/data/logos/') }}`
        this.GET_COINS_DATAS = 'api/v1/coins/list'

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


document.addEventListener('DOMContentLoaded', function () {
    urls_manager = new URLS_MANAGER()
    follow_lists_manager = new followListsManager()
    follow_lists_url_manager = new followListsUrlManager()
    data_handler = new DataHandlers
    coin_info_modal_manager = new coinInfoModal()

    get_coin_chart_data(data_handler.handleCoinChartData, '1', 'week')
    // TODO: CHANGE BACK LIMIT TO 1000
    data = get_data_with_skip_limit(data_handler.handleDataAndFillTable, 'usd', 0, 1000)
    follow_lists_modal_manager = new followListsModalManager()

})
