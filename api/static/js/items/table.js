function fillTable(data, currency) {
    table_data.innerHTML = ''
    let top = selected_coins_top
    for (let i in data) {
        top++
        table_data.innerHTML +=
        `<tr>
            <th scope="row">${top}</th>
            <td style="text-align: left"><img width="35px" class="img img-thumbnail" src="${LOGOS_URI+data[i]['id']}.png" alt="">${data[i]['name']}</td>
            <td>${data[i]['price'].toFixed(2)}</td>
            <td>${data[i]['marketcap']}</td>
            <td>${data[i]['volume']}</td>
            <td>${data[i]['performance']['hour']}</td>
            <td>${data[i]['performance']['day']}</td>
            <td>${data[i]['performance']['week']}</td>
            <td>${data[i]['performance']['month']}</td>
            <td>${data[i]['performance']['year']}</td>
            <td>Links</td>
        </tr>`
    }

}
