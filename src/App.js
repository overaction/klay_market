import Caver from 'caver-js'
import {getBalance, readCount, setCount} from './api/UseCaver';
import QRCode from "qrcode.react"
import { useState } from 'react';
import * as KlipAPI from "./api/UseKlip";
// ABI란? Application Binary Interface
// => 사용 설명서. 즉 외부에서 스마트컨트랙트 호출할 때 스마트 컨트랙트에 어떤 기능이 있고 어떤 변수를 넣어주면 된다 라는 내용을 담고있다.
// 모든 내용을 알고있을 필요가 없기 때문에 사용한다.

// 블럭체인에 여러가지 주소를 가진 스마트컨트랙트들이 많기 때문에 내가 가진 주소를 통해 스마트컨트랙트를 찾아감.
// ABI를 사용해서 호출을 한다.
// CaverJS는 ABI를 사용해서 우리가 보낸 코드를 컴퓨터가 알아들을 수 있는 16진수로 코드를 변환해준다.


// 1 Smart Contract 배포 주소 파악(가져오기)

// 2 Caver.js 이용해서 스마트 컨트랙트 연동하기

// 3 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기


const DEFAULT_QR_CODE = "DEFAULT";
function App() {
    const [qrvalue, setQrValue] = useState(DEFAULT_QR_CODE);
    const onClickgetAddress = () => {
        KlipAPI.getAddress(setQrValue);
    }
    const onClicksetCount = () => {
        KlipAPI.setCount(2000,setQrValue);
    }
    //readCount()
    //getBalance('0xFA2DBE992dd0D021f815c8c897d6661CAAF60845')
    return (
        <div className="App">
            <button onClick={() => onClickgetAddress()}>주소 가져오기</button>
            <button onClick={() => onClicksetCount()}>카운트 변경</button>
            <br />
            <QRCode value={qrvalue} />
        </div>
    )
}

export default App
