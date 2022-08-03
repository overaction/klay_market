import Caver from 'caver-js'
import CountABI from '../abi/CountABI.json';
import { ACCESS_KEY_ID, CHAIN_ID, COUNT_CONTRACT_ADDRESS, SECRET_KEY_ID } from '../constants';
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
    CountABI,
    COUNT_CONTRACT_ADDRESS
)
export const readCount = async () => {
    console.log(CountContract)
    const countResult = await CountContract.methods.count().call()
    console.log(countResult)
}

export const getBalance = address => {
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

export const setCount = async newCount => {
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