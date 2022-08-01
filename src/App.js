import Caver from 'caver-js'

const COUNT_CONTRACT_ADDRESS = '0x472bACC1627B46c57883E10031Dbd3A897E17e52'
const ACCESS_KEY_ID = 'KASKGAH3X758WMZ64GC79HW9'
const SECRET_KEY_ID = 'IP0Jp8lFfcXyqu3XVTZvWXHa4HdF1R0iFYRvwnFz'

const CHAIN_ID = '1001' // MainNet : 8217 , TESTNET : 1001
// ABI란? Application Binary Interface
// => 사용 설명서. 즉 외부에서 스마트컨트랙트 호출할 때 스마트 컨트랙트에 어떤 기능이 있고 어떤 변수를 넣어주면 된다 라는 내용을 담고있다.
// 모든 내용을 알고있을 필요가 없기 때문에 사용한다.

// 블럭체인에 여러가지 주소를 가진 스마트컨트랙트들이 많기 때문에 내가 가진 주소를 통해 스마트컨트랙트를 찾아감.
// ABI를 사용해서 호출을 한다.
// CaverJS는 ABI를 사용해서 우리가 보낸 코드를 컴퓨터가 알아들을 수 있는 16진수로 코드를 변환해준다.
const COUNT_ABI =
    '[ { "constant": true, "inputs": [], "name": "count", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockNumber", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]'

const option = {
    headers: [
        {
            name: 'Authorization',
            value:
                'Basic ' +
                Buffer.from(ACCESS_KEY_ID + ':' + SECRET_KEY_ID).toString(
                    'base64'
                ),
        },
        { name: 'x-chain-id', value: CHAIN_ID },
    ],
}

const caver = new Caver(
    new Caver.providers.HttpProvider(
        'https://node-api.klaytnapi.com/v1/klaytn',
        option
    )
)
const CountContract = new caver.contract(
    JSON.parse(COUNT_ABI),
    COUNT_CONTRACT_ADDRESS
)
const readCount = async () => {
    console.log(CountContract)
    const countResult = await CountContract.methods.count().call()
    console.log(countResult)
}

const getBalance = address => {
    return caver.rpc.klay.getBalance(address).then(res => {
        console.log('res : ' + res)
        const balance = caver.utils.convertFromPeb(
            caver.utils.hexToNumberString(res)
        )
        console.log(caver.utils.hexToNumberString(res))
        console.log(balance)
        return balance
    })
}

const setCount = async newCount => {
    // 사용할 account 설정
    try {
        const privateKey =
            '0xcedd265c437c5c217bf2e8991d6c180467f6b96320b3dbc3c01471acb915ed1d'
        const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey)
        caver.wallet.add(deployer)
        // 스마트 컨트랙트 실행 트랜잭션 날리기
        // 결과 확인
        const receipt = await CountContract.methods.setCount(newCount).send({
            from: deployer.address, // address
            gas: '0x4bfd200', // 가스비는 실행되는데 필요한만큼 사용되고 나머지는 돌아옴
        })
        console.log(receipt)
    } catch (e) {
        console.log('error : ', e)
    }
}
// 1 Smart Contract 배포 주소 파악(가져오기)

// 2 Caver.js 이용해서 스마트 컨트랙트 연동하기

// 3 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기

function App() {
    readCount()
    getBalance('0xFA2DBE992dd0D021f815c8c897d6661CAAF60845')
    return (
        <div className="App">
            <button onClick={() => setCount(150)}>카운트 변경</button>
        </div>
    )
}

export default App
