const chartDiv = document.getElementById('modalBody')

function createChart(data) {

    chartDiv.innerHTML = `<canvas id='myChart'></canvas>`
    const ctx = document.getElementById('myChart').getContext('2d')

    let data_labels = []
    let data_datasets = []

    for (let key in data) {
        data_labels.push(data[key]["t"])
        data_datasets.push(data[key]["p"])
    }

    console.log(data_labels)
    console.log('Its data labe and then will be datasets')
    console.log(data_datasets)

    chart = new Chart(ctx, {
      type: "line",
      data: {
    labels: data_labels,
    datasets: [{
      label: '',
      borderColor: "rgb(13,182,255)",
      data: data_datasets,
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
      pointHitRadius: 4,
    }]
  },
  options: {

      plugins: {
          subtitle: {
              display: false,
          },
          tooltips: {
              mode: 'index',
              intersect: false},
          legend: {
              display: false,
            },

      },
    scales: {
      x: {
        ticks: {
          display: false // Hide x-axis legend
        },
        grid: {
          display: false
        }
      },
      y: {
        display: false, // Hide y-axis legend
        grid: {
          display: false
        }
      }
    },
    backgroundColor: 'transparent'
  }
});


}
