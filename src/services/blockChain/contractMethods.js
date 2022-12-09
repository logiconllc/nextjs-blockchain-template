import AppApi from '../../api/app'
import AuthApi from '../../api/auth'
import { contractConnection } from './contractConnection'
import { account } from './metaMaskConnection';
let WIE_UNIT = 1000000000000000000;//matic to wie 

let buyTicket = async (data) => {
    try {
        let contract = await contractConnection();
        if (contract) {
            console.log("contract methods params:", data)
            // data.price * WIE_UNIT,
            console.log("from address", account);
            // console.log((data.price * WIE_UNIT).toString())
            // let result = await contract.methods.mintTicketsWithFixPrice("0xacf892fcacb68e70650652de7d9289481c3b8b61", 9, 2).send({
            let result = await contract.methods.mintTicketsWithFixPrice(data.address, data.ticketId, data.noOfCopies).send({
                from: account,
                value: (data.price * WIE_UNIT).toString()
            }, (error, transactionHash) => {
                console.log(error)
                console.log(transactionHash)
            }).on('receipt', function (data) {
                console.log(data)
                // return { success: true, message: "Event created successfully" };
            }).on('error', function (error) {
                console.log(error);
                return { error: true, message: "Transaction error form blockChain please try later." };
            });
            return result
        } else {
            return { status: true, message: "Contract connection failed." }
        }
    } catch (error) {
        console.log(error)
        let message = ""
        if (error.message.includes("EVM:")) {
            message = "Transaction error form blockChain please try later."
        } else {
            message = error.message
        }
        return { status: true, message: message }
    }

} 

let dropSiteStatus = async () => {
    try {
        let contract = await contractConnection();
        // let account = await getConnectedAccount();
        let result = await contract.methods.paused().call()
        console.log("Drop site status: ", result);
        return result
    } catch (error) {
        console.log("error on getting dropSiteStatus", error)
        return ""
    }
}
let eventStatus = async (id) => {
    try {
        let contract = await contractConnection();
        // let account = await getConnectedAccount();
        let result = await contract.methods.eventIsPaused(id).call()
        console.log("event status: ", result);
        return result
    } catch (error) {
        console.log("error on getting dropSiteStatus", error)
        return ""
    }
}



export { buyTicket, dropSiteStatus, eventStatus }
