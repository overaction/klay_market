import Caver from 'caver-js'
import { getBalance, readCount, setCount } from './api/UseCaver'
import QRCode from 'qrcode.react'
import { useState } from 'react'
import * as KlipAPI from './api/UseKlip'

const DEFAULT_ADDRESS = "0x00"
const DEFAULT_QR_CODE = 'DEFAULT'

function App() {
    const [myBalance, setMyBalance] = useState('0')
    const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS)
    const [nfts, setNfts] = useState([]);

    // UI
    const [qrValue, setQrValue] = useState(DEFAULT_QR_CODE);
    const getUserData = () => {
        KlipAPI.getAddress(setQrValue, async(address) => {
            setMyAddress(address)
            const nowBalance = await getBalance(address);
            setMyBalance(nowBalance);
        })
    }

    return (
        <div>
            <div onClick={getUserData}>
                잔고 : {myBalance}
                주소 : {myAddress}
            </div>
            <QRCode value={qrValue} />
        </div>
    )
}

export default App
