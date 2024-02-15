
class followListsModalManager {

    constructor() {
        this.modal_content = document.getElementById('follow-lists_modalBody')
        this.modal = new bootstrap.Modal(document.getElementById('staticBackdrop_follow_list'))
        this.coins_content = document.getElementById('follow-lists_modalCoins')
        this.new_follow_list_input = document.getElementById('follow-lists_input_new_follow_list_name')

    }

    openFollowListsModal() {


        this.modal_content.innerHTML = ''

        follow_lists_manager.getFollowLists(data_handler.handleFollowLists)
        this.modal.show()
    }

    createNewFollowList = async () => {
        console.log(this.new_follow_list_input.value)
        let new_list_name = this.new_follow_list_input.value
        await follow_lists_manager.create_new_follow_list(new_list_name)

    }

    openFollowList(list_name) {
        this.coins_content.innerHTML = ''
        console.log(`Sent list name is : ${list_name}`)
        let follow_list
        for (let list of follow_lists) {
            if (list['name'].toString() === list_name.toString()) {
                follow_list = list['coins']

            }
        }

        for (let coin of follow_list) {
            this.coins_content.innerHTML += `<img class="img img-thumbnail" width='35px' src="${LOGOS_URI+coin.toString()}.png" alt=""/>`
        }

    }

    createFollowList(list_name) {



    }

}
