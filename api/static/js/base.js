let table_data = document.getElementById('table-body')

function get_data_with_skip_limit(callback, currency, skip, limit) {
    selected_coins_top = skip
    return $.ajax({
        url: urls_manager.getMarketCapWithSkipLimitUrl(currency),
        method: 'get',
        data: {
            skip: `${skip}`,
            limit: `${limit}`,
        },
        success: function (data) {
            callback(data)
        },


    })
}


function get_coin_chart_data(callback, coin_id, timestamp) {
    chartDiv.innerHTML = `<img class="img img-thumbnail" style="width: 100px" src="${LOGOS_URI+coin_id}.png" alt=""/>`

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

let selected_coin_data = null

function get_coin_data_by_id(coin_id, currency) {

    $.ajax({
        url: urls_manager.GET_COIN_DATA + coin_id + `/${currency}`,
        method: 'get',
        success: function (data) {
            console.log(data)
            selected_coin_data = data
        }
     })

}
