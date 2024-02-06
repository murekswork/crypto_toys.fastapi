function createChart(data) {

    let chartDiv = document.getElementById('chart-container')

    chartDiv.innerHTML += `<canvas id="chart"></canvas>`

    const ctx = document.getElementById('chart')

    let data_labels = []
    let data_datasets = [{
        label: 'Data',
        data: []
    }]

    for (let key in data) {
        data_labels.push(data[key]["t"])
        data_datasets[0].data.push(data[key]["p"])
    }

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data_labels,
            datasets: data_datasets
        },

        options: {
            fill: false,
            borderColor: 'rgb(75,102,132)',
            tension: 0.1
        }
    })

}