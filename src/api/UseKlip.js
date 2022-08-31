import axios from 'axios'
import { COUNT_CONTRACT_ADDRESS } from '../constants';

const A2P_API_PREPARE_URL = 'https://a2a-api.klipwallet.com/v2/a2a/prepare';

export const getAddress = (setQrValue, callBack) => {
    axios
        .post(A2P_API_PREPARE_URL, {
            bapp: {
                name: 'KLAY_MARKET',
            },
            type: 'auth',
        })
        .then(res => {
            console.log(res)
            const { request_key } = res.data
            // qrcode 사용하기
            const qrCode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
            setQrValue(qrCode);
            let klipLogin = setInterval(() => {
                axios
                    .get(
                        `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
                    )
                    .then(res => {
                        if (res.data.result) {
                            console.log(`[Result] ${JSON.stringify(res.data.result)}`)
                            // 콜백함수 실행
                            callBack(res.data.result.klaytn_address)
                            if(res.data.result.status === 'success') clearInterval(klipLogin);
                        }
                    })
            }, 1000)
        })
}

export const setCount = (count, setQrValue) => {
    axios
        .post(A2P_API_PREPARE_URL, {
            bapp: {
                name: 'KLAY_MARKET',
            },
            type: 'execute_contract',
            transaction: {
                to: COUNT_CONTRACT_ADDRESS,
                abi: '{ "constant": false, "inputs": [{ "name": "_count", "type": "uint256" }], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
                value: "0",
                params: `[\"${count}\"]`
            }
        })
        .then(res => {
            console.log(res)
            const { request_key } = res.data
            // qrcode 사용하기
            const qrCode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
            setQrValue(qrCode);
            let klipLogin = setInterval(() => {
                axios
                    .get(
                        `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
                    )
                    .then(res => {
                        if (res.data.result) {
                            console.log(`[Result] ${JSON.stringify(res.data.result)}`)
                            clearInterval(klipLogin);
                        }
                    })
            }, 1000)
        })
}
