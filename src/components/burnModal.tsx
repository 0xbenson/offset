import Fire from '../assets/fire.png';
import PendingApproval from '../assets/approving.png'

export function BurnModal(props: {setBurnModal: (a: boolean) => void}) {
    return (
      <div onClick = {() => {props.setBurnModal(false); }} className = 'modalBackground'>
        <div className = 'modalContainer'>
          <div className = 'modalHeader'>
            <span className = 'CardTitle'>Burn</span>
            <button className = 'modalClose' onClick = {() => props.setBurnModal(false)}>&times;</button>
          </div>
          <div className = 'loading'>
            <img id = 'burnSymbol' className = 'loadingSymbol' src = {Fire} alt = ""/>
            <img id = "approvalpic" className = "Approving" src = {PendingApproval} alt = "approving"/>
          </div>
          <p id = 'approvingStatus' style = {{margin: 'auto'}}>
            Burning...
          </p>
        </div>
      </div>
    )
  }