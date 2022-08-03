import axios from 'axios'

export const getAddress = (setQrValue) => {
    axios
        .post('https://a2a-api.klipwallet.com/v2/a2a/prepare', {
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
                            clearInterval()
                        }
                    })
            }, 1000)
        })
}
