let get_data_button = document.getElementById('get-data-button')

get_data_button.addEventListener('click', function () {
    let currency = document.getElementById('currency-selector').value
    let skip = document.getElementById('skip-input').value
    let limit = document.getElementById('limit-input').value
    get_data_with_skip_limit(handleCoinsData, currency, skip, limit)
})

function get_coin_chart_button(coin_id, timestamp) {
    get_coin_chart_data(handleCoinChartData, coin_id, timestamp)


}


function handleCoinChartData(data) {
    let content = document.getElementById('content')
    console.log(data)
    createChart(data)
}


function handleCoinsData(data) {
    let content = document.getElementById('content')
    content.innerHTML = ''
    for (let i in data) {
        content.innerHTML += `<p>${data[i]["name"]}</p><a href="#" onclick="get_coin_chart_button(${data[i]["id"]}, 'day')">${data[i]["id"]} get daily chart</a>`
        content.innerHTML += `<p>${data[i]["name"]}</p><a href="#" onclick="get_coin_chart_button(${data[i]["id"]}, 'week')">${data[i]["id"]} get weekly chart</a>`
        content.innerHTML += `<p>${data[i]["name"]}</p><a href="#" onclick="get_coin_chart_button(${data[i]["id"]}, 'month')">${data[i]["id"]} get month chart</a>`
    }
}