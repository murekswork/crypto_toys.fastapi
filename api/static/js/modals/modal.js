function openCoinInfoModal(coin_id) {

    for (let coin in current_coins_data) {
        console.log(coin)
        if (current_coins_data[coin]["id"] === coin_id) {
            selected_coin = current_coins_data[coin]
            console.log(coin)
            break
        }
    }
    console.log(selected_coin)

    let coin_name = document.getElementById('modal-coin-name')
    coin_name.innerText = selected_coin["name"]
    modal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
        modal.show()

    document.getElementById('hour diff').innerText = selected_coin['performance']['hour']
    document.getElementById('day diff').innerText = selected_coin['performance']['day']
    document.getElementById('week diff').innerText = selected_coin['performance']['week']
    document.getElementById('month diff').innerText = selected_coin['performance']['month']
    document.getElementById('year diff').innerText = selected_coin['performance']['year']

    for (let perf of document.getElementsByClassName('coin-performance')) {
    if (parseFloat(perf.innerText) < -2) {
        perf.parentElement.style.background = 'rgba(255,52,52,0.3)';
    } else if (parseFloat(perf.innerText) > 2) {
        perf.parentElement.style.background = 'rgba(87,255,87,0.3)';
    } else {
        perf.parentElement.style.background = 'rgba(101,255,234,0.3)';
    }

}





    data = get_coin_chart_data(handleCoinChartData, coin_id, 'day')


}
