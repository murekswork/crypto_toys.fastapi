class followListsUrlManager {


    constructor() {
        this.URL_GET_ALL_FOLLOW_LISTS = 'api/v1/me/follow_lists'
        this.URL_CREATE_FOLLOW_LISTS = '/me/follow_lists'
        this.URL_ADD_TO_FOLLOW_LIST = '/me/follow_lists/'
        this.GET_FOLLOW_LISTS_URL = 'me/follow_lists/'
    }


}

class followListsManager {

    constructor() {
        this.urls_manager = new followListsUrlManager()
    }

    getFollowLists(callback) {
        return $.ajax({
            url: this.urls_manager.GET_FOLLOW_LISTS_URL,
            method: 'get',
            success: function (data) {
                callback(data)
            }
        })
    }

    create_new_follow_list(list_name) {
        console.log(JSON.stringify({'name': list_name}))
        $.ajax({
            url: follow_lists_url_manager.URL_CREATE_FOLLOW_LISTS,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({name: list_name}),
            success: function (data) {
                console.log(data)
            }
        })

    }

    add_coin_to_follow_list(list_name, coin_id) {
        $.ajax({
            url: follow_lists_url_manager.URL_ADD_TO_FOLLOW_LIST + list_name,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },

            data: JSON.stringify(
                {
                    list_name: list_name,
                    coin_id: coin_id
                }
            ),
            success: function (data) {
              console.log(data)
            }
        })
    }

}


function drawBubblesWithFollowList(coins) {

    let dataToDraw = null
    console.log(coins)
    console.log('Its coins')
    dataToDraw = getCoinsDataByIds(JSON.parse(coins))
    console.log(dataToDraw)
    console.log("Its drawed coins")

    drawBubbles(dataToDraw, 'marketcap')

}
