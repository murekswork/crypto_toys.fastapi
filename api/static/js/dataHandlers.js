class DataHandlers {


    handleDataAndFillTable(data) {
        current_coins_data = data
        if (data.length >= 100) {
            let correct_data = data.slice(0, 100)
            fillTable(correct_data, 'usd')
            drawBubbles(correct_data, 'marketcap')
            return correct_data
        }
        fillTable(data, 'usd')
        drawBubbles(data, 'marketcap')
        return data
    }


    handleCoinChartData(data) {
        let content = document.getElementById('content')
        console.log(data)
        createChart(data)

    }

    handleFollowLists(data) {
        follow_lists = data
        let modal_body = document.getElementById('follow-lists_modalBody')
        modal_body.innerHTML = ''
        for (let list of data) {
            console.log(list)
            modal_body.innerHTML += `<a onclick="follow_lists_modal_manager.openFollowList(this.textContent)"><span class="badge badge-pill"><small class="fs-4">${list['name']}</small></span></a>`
        }

    }

    handleDataAndDrawBubbles(data, field) {

        drawBubbles(data, field)
    }

}
