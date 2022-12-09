import AppApi from '../../api/app'
import AuthApi from '../../api/auth'

// import ABI from './ABI.json'
// let ADDRESS = "CONTRACT-ADDRESS"

import Web3 from 'web3';

let contractConnection = async () => {
    try {
        let web3 = new Web3(window.ethereum);
        let res = await AppApi.getNetworks();
        if (res.status == 200) {
            let network = res.data.data[0];
            let ADDRESS = network.networkAddress
            let ABI = network.networkAbi;
            let contract = new web3.eth.Contract(ABI, ADDRESS);
            return contract
        } else {
            return ""
        }
    } catch (error) {
        console.log(error);
        return error
    }

}



export { contractConnection }