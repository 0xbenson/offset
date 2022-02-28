import Fire from '../assets/fire.png';
import PendingApproval from '../assets/approving.png'

export function BurnModal(props: {setBurnModal: (a: boolean) => void}) {
    return (
      <div onClick = {() => {props.setBurnModal(false); }} className = 'modalBackground'>
        <div style = {{textAlign: 'center'}} className = 'modalContainer'>
          <div style = {{paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <span style = {{paddingBottom: '60px', fontWeight: '600', fontSize: '20px'}}>Burn</span>
            <button className = 'modalClose' onClick = {() => props.setBurnModal(false)}>&times;</button>
          </div>
          <div style = {{position: 'relative', paddingBottom: '20px', paddingLeft: '85px'}}>
            <img id = 'burnSymbol' style = {{paddingLeft: '75px', paddingTop: '68px', position: 'absolute', height: '60px'}} src = {Fire} alt = ""/>
            <img id = "approvalpic" className = "Approving" src = {PendingApproval} alt = "approving"/>
          </div>
          <p id = 'approvingStatus' style = {{margin: 'auto'}}>
            Burning...
          </p>
        </div>
      </div>
    )
  }