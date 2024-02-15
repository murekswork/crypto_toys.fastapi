class coinInfoModal {

    constructor() {
        this.calculate_input = document.getElementById('coin-calculator')
        this.calculate_result = document.getElementById('coin-calculator-result')
        this.calculate_input.addEventListener('input', this.handleCalculateInput.bind(this));
        this.coin_price = document.getElementById('coin-calculator-coin-price')
        this.add_badge = document.getElementById('coin-info-modal_add-badge')
        this.add_badge.addEventListener('click', this.handleAddBadgeFocus.bind(this))
        this.list_selector = document.getElementById('select-follow-list')

    }

    async handleAddBadgeFocus() {
        await follow_lists_manager.getFollowLists(data_handler.handleFollowLists)
        this.add_badge.hidden = 'hidden'
        this.list_selector.innerHTML += '<div id="add_badge_opened" class="container d-inline text-light" style="position: fixed; right: 0; height: 50%; width: 25%; border-radius: 20%; border: white; backdrop-filter: blur(15px)"></div>'

        console.log(follow_lists)
        for (let i of follow_lists) {
            document.getElementById('add_badge_opened').innerHTML += `<p onclick="follow_lists_manager.add_coin_to_follow_list(this.textContent, selected_coin['id'])" class="">${i['name']}</p>`
        }

    }

    async addCoinToFollowList(list_name) {


    }


    handleCalculateInput(event) {
        this.current_coin_price = parseFloat(selected_coin['price'])
        this.volume = this.calculate_input.value
        console.log(this.calculate_input.value)
        this.calculate_result.innerText =`${(parseFloat(this.calculate_input.value) * parseFloat(this.current_coin_price)).toFixed(3)}`
        console.log(this.current_coin_price)
    }



    openCoinInfoModal(coin_id) {
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
        let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
        modal.show()
        this.coin_price.textContent = `за 1 ${selected_coin['symbol']} ${selected_coin['price'].toFixed(2)} ${selected_currency.toUpperCase()}`

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


        get_coin_chart_data(data_handler.handleCoinChartData, coin_id, 'day')


    }


}

//
// function openCoinInfoModal(coin_id) {
//
//     for (let coin in current_coins_data) {
//         console.log(coin)
//         if (current_coins_data[coin]["id"] === coin_id) {
//             selected_coin = current_coins_data[coin]
//             console.log(coin)
//             break
//         }
//     }
//     console.log(selected_coin)
//
//     let coin_name = document.getElementById('modal-coin-name')
//     coin_name.innerText = selected_coin["name"]
//     modal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
//         modal.show()
//
//     document.getElementById('hour diff').innerText = selected_coin['performance']['hour']
//     document.getElementById('day diff').innerText = selected_coin['performance']['day']
//     document.getElementById('week diff').innerText = selected_coin['performance']['week']
//     document.getElementById('month diff').innerText = selected_coin['performance']['month']
//     document.getElementById('year diff').innerText = selected_coin['performance']['year']
//
//     for (let perf of document.getElementsByClassName('coin-performance')) {
//     if (parseFloat(perf.innerText) < -2) {
//         perf.parentElement.style.background = 'rgba(255,52,52,0.3)';
//     } else if (parseFloat(perf.innerText) > 2) {
//         perf.parentElement.style.background = 'rgba(87,255,87,0.3)';
//     } else {
//         perf.parentElement.style.background = 'rgba(101,255,234,0.3)';
//     }
//
// }
//
//
//     data = get_coin_chart_data(data_handler.handleCoinChartData, coin_id, 'day')
//
//
// }
