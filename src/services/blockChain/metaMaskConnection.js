import AppApi from '../../api/app'
import AuthApi from '../../api/auth'
import Web3 from 'web3';

let account

let connectMetaMask = async (networkId, autoConnect = false) => {
    try {
        let res = await AppApi.getNetworks();
        if (res.status == 200) {
            let network = res.data.data[0];
            console.log(network.networkId)
            if (typeof window.ethereum !== 'undefined') {
                let ethereum = window.ethereum
                let web3 = new Web3(ethereum);
                console.log(web3);
                if (!autoConnect) {
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: network.networkId }],
                    });
                }
                let accounts = await window.ethereum
                    .request({
                        method: "eth_requestAccounts",
                    })
                console.log("accounts", accounts)
                if (accounts) {
                    account = accounts[0];
                    let balance = await web3.eth.getBalance(accounts[0]).then((bal) => {
                        console.log('balance:', parseFloat(web3.utils.fromWei(bal, 'ether')).toFixed(4));
                        return parseFloat(web3.utils.fromWei(bal, 'ether')).toFixed(4);
                    });
                    let message = "Login to global pass"
                    if (!autoConnect) {
                        let token = await web3.eth.personal.sign(message, account);
                        if (token) {
                            let apiResult = await AuthApi.metaMaskLogin({
                                token: token,
                                login_message: message
                            });
                            if (apiResult && apiResult.status == 200) {
                                let token = apiResult.data.data.token
                                localStorage.setItem("token", token);
                                if (token) {
                                    console.log(res);
                                    //TODO 
                                    //   ethereum.on('connect', handler: (connectInfo: ConnectInfo) => void);
                                    // ethereum.on('disconnect', handler: (error: ProviderRpcError) => void);
                                    // ethereum._metamask.isUnlocked()
                                    // ethereum.isConnected()
                                    // console.log(ethereum.isConnected())
                                    let chainId = await ethereum.request({ method: 'eth_chainId' });
                                    console.log(chainId)
                                    if (chainId === network.networkId) {
                                        return { connected: true, account, balance, token, messages: "Login successfully.", profile: apiResult.data.data };
                                    } else {
                                        return { connected: false, account: "", messages: "you are not on right network.You need to connect you metaMask wallet to Mumbai-Test-Net." }
                                    }
                                } else {
                                    return { connected: false, account: "", messages: "Login failed." }
                                }
                            } else {
                                return { connected: false, account: "", messages: "Account login failed." }
                            }
                        } else {
                            return { connected: false, account: "", messages: "login failed due to token." }
                        }
                    } else {
                        ethereum.on('accountsChanged', async function (accounts) {
                            localStorage.removeItem("token");
                            localStorage.removeItem("profile");
                            window.location.reload();
                        });
                        ethereum.on('chainChanged', (chainId) => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("profile");
                            window.location.reload();
                        });
                        let token = localStorage.getItem("token")
                        return { connected: true, account, balance, token, messages: "Login successfully." };
                    }
                } else {
                    return { connected: false, account: "", messages: "" }
                }
            } else {
                return { connected: false, account: "", messages: "Please install metaMask extension in your chrome browser." }
            }
        } else {
            return { connected: false, account: "", messages: "Network not found" }
        }
    } catch (error) {
        return { connected: false, account: "", messages: error.message }
    }
}

export { connectMetaMask, account }

