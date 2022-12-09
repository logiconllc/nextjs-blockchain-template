import axios from "../utils/axios";

let Auth = {
    yourApi: (data) => axios({
        url: '/apiLink',
        method: 'post',
        data
    })
}

export default Auth

