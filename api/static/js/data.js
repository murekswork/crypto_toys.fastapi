let selected_currency = 'usd'
let selected_coin = null
const LOGOS_URL = `{{ url_for('static', path='data/logos/') }}`
let urls_manager
let follow_lists_manager
let current_coins_data
let selected_coins_top = 0
var bubbles = [];
function changeSelectedCurrency(currency) {
    selected_currency = currency
}
