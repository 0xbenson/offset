import {
  BCTcontractAddress,
  USDCcontractAddress,
  KLIMAcontractAddress,
  sKLIMAcontractAddress,
  wsKLIMAcontractAddress,
  MCO2contractAddress
} from '../contracts';

import BCTbox from '../assets/BCTbox.png';
import MCO2box from '../assets/MCO2box.png';
import USDCbox from '../assets/USDCbox.png';
import KLIMAbox from '../assets/KLIMAbox.png';

function ModalSelector(props: {logo: string, setCurrentCoin: (c: string) => void, setCoinModal: (b: boolean) => void, setSourceToken: (s: string) => void, setPoolToken: (a: string) => void, setCarbonType: (a: string) => void, balance: number, isSelected: boolean, coin: string, coinAddress: string}) {
  return (
    <button style = {{backgroundColor: props.isSelected ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {
      props.setCurrentCoin(props.coin); props.setCoinModal(false);
      props.setSourceToken(props.coinAddress);
      if (props.coin === 'BCT' || props.coin === 'MCO2') {
        props.setPoolToken(props.coinAddress);
        props.setCarbonType(props.coin);
      }
    }}>
      <img className = 'coinBox' src = {props.logo} alt = 'CoinLogo' />
      <div className = 'coinDetails'>
        <div className = 'coinName'>{props.coin}</div>
        <div className = 'coinBalance'>{props.balance.toFixed(4) + ' ' + props.coin}</div>
      </div>
    </button>
  )
}

export function CoinModal(props: {currentCoin: string, setModalOpen: (b: boolean) => void, setSourceToken: (adress: string) => void, setCurrentCoin: (coin: string) => void, setPoolToken: (a: string) => void, setCarbonType: (a: string) => void,BCTbalance: number, USDCbalance: number, KLIMAbalance: number, sKLIMAbalance: number, wsKLIMAbalance: number, MCO2balance: number}) {
    return (
      <div onClick = {() => { props.setModalOpen(false); }} className = 'modalBackground'>
        <div className = 'modalContainer'>
          <div className = 'modalHeader'>
            <span className = 'CardTitle'>Select Token</span>
            <button className = 'modalClose' onClick = {() => props.setModalOpen(false)}>&times;</button>
          </div>
          <div>
            <ModalSelector logo = {BCTbox} coin = 'BCT' isSelected = {props.currentCoin === 'BCT'} balance = {props.BCTbalance} coinAddress = {BCTcontractAddress} setSourceToken = {props.setSourceToken} setCoinModal = {props.setModalOpen} setCurrentCoin = {props.setCurrentCoin} setPoolToken = {props.setPoolToken} setCarbonType = {props.setCarbonType} />
            <ModalSelector logo = {MCO2box} coin = 'MCO2' isSelected = {props.currentCoin === 'MCO2'} balance = {props.MCO2balance} coinAddress = {MCO2contractAddress} setSourceToken = {props.setSourceToken} setCoinModal = {props.setModalOpen} setCurrentCoin = {props.setCurrentCoin} setPoolToken = {props.setPoolToken} setCarbonType = {props.setCarbonType} />
            <ModalSelector logo = {USDCbox} coin = 'USDC' isSelected = {props.currentCoin === 'USDC'} balance = {props.USDCbalance} coinAddress = {USDCcontractAddress} setSourceToken = {props.setSourceToken} setCoinModal = {props.setModalOpen} setCurrentCoin = {props.setCurrentCoin} setPoolToken = {props.setPoolToken} setCarbonType = {props.setCarbonType} />
            <ModalSelector logo = {KLIMAbox} coin = 'KLIMA' isSelected = {props.currentCoin === 'KLIMA'} balance = {props.KLIMAbalance} coinAddress = {KLIMAcontractAddress} setSourceToken = {props.setSourceToken} setCoinModal = {props.setModalOpen} setCurrentCoin = {props.setCurrentCoin} setPoolToken = {props.setPoolToken} setCarbonType = {props.setCarbonType} />
            <ModalSelector logo = {KLIMAbox} coin = 'sKLIMA' isSelected = {props.currentCoin === 'sKLIMA'} balance = {props.sKLIMAbalance} coinAddress = {sKLIMAcontractAddress} setSourceToken = {props.setSourceToken} setCoinModal = {props.setModalOpen} setCurrentCoin = {props.setCurrentCoin} setPoolToken = {props.setPoolToken} setCarbonType = {props.setCarbonType} />
            <ModalSelector logo = {KLIMAbox} coin = 'wsKLIMA' isSelected = {props.currentCoin === 'wsKLIMA'} balance = {props.wsKLIMAbalance} coinAddress = {wsKLIMAcontractAddress} setSourceToken = {props.setSourceToken} setCoinModal = {props.setModalOpen} setCurrentCoin = {props.setCurrentCoin} setPoolToken = {props.setPoolToken} setCarbonType = {props.setCarbonType} />
          </div>
        </div>
      </div>
    )
}