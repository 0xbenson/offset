import {
    BCTcontractAddress,
    MCO2contractAddress,
} from '../contracts';

import BCTbox from '../assets/BCTbox.png';
import MCO2box from '../assets/MCO2box.png';

function ModalSelector(props: {logo: string, setCarbonType: (c: string) => void, setModal: (b: boolean) => void, setPoolToken: (s: string) => void, isSelected: boolean, carbonType: string, poolAddress: string}) {
    return (
      <button style = {{backgroundColor: props.isSelected ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {props.setCarbonType(props.carbonType); props.setModal(false); props.setPoolToken(props.poolAddress);}}>
        <img className = 'coinBox' src = {props.logo} alt="USDC" />
        <div className = 'coinDetails'>
          <div className = 'coinName'>{props.carbonType}</div>
        </div>
      </button>
    )
  }

export function CarbonModal(props: {currentCarbonType: string, setModal: (b: boolean) => void, setPoolToken: (address: string) => void, setCurrentCarbonType: (coin: string) => void}) {
    return (
      <div onClick = {() => { props.setModal(false); }} className = 'modalBackground'>
        <div className = 'modalContainer'>
          <div className = 'modalHeader'>
            <span className = 'CardTitle'>Select Carbon Type</span>
            <button className = 'modalClose' onClick = {() => props.setModal(false)}>&times;</button>
          </div>
          <div>
            <ModalSelector logo = {BCTbox} carbonType = 'BCT' isSelected = {props.currentCarbonType === 'BCT'} poolAddress = {BCTcontractAddress} setPoolToken = {props.setPoolToken} setModal = {props.setModal} setCarbonType = {props.setCurrentCarbonType} />
            <ModalSelector logo = {MCO2box} carbonType = 'MCO2' isSelected = {props.currentCarbonType === 'MCO2'} poolAddress = {MCO2contractAddress} setPoolToken = {props.setPoolToken} setModal = {props.setModal} setCarbonType = {props.setCurrentCarbonType} />
          </div>
        </div>
      </div>
    )
  }