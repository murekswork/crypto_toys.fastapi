let urls_manager

function get_data_with_skip_limit(callback, currency, skip, limit) {

    return $.ajax({
        url: urls_manager.getMarketCapWithSkipLimitUrl(currency),
        method: 'get',
        data: {
            skip: `${skip}`,
            limit: `${limit}`,
        },
        success: function (data) {
            callback(data)
    }
    })
}

function get_coin_chart_data(callback, coin_id, timestamp) {

    return $.ajax({
        url: urls_manager.getCoinChartUrl(),
        method: 'get',
        data: {
          coin_id: coin_id,
          timestamp: timestamp,
        },
        success: function (data) {
            callback(data)
        }
    })
}