class followListsUrlManager {


    constructor() {
        this.URL_GET_ALL_FOLLOW_LISTS = 'api/v1/me/follow_lists'
        this.URL_CREATE_FOLLOW_LISTS = '/me/follow_lists'
        this.URL_ADD_TO_FOLLOW_LIST = '/me/follow_lists/'
    }


}


let follow_lists_manager

class followListsManager {

    constructor() {
        this.urls_manager = new followListsUrlManager()
    }

    getFollowLists() {
        $.ajax({
            url: this.urls_manager.URL_GET_ALL_FOLLOW_LISTS,
            method: 'get',
            success: function (data) {
                console.log(data)
            }
        })
    }

}