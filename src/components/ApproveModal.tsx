import PendingApproval from '../assets/approving.png';

export function ApproveModal(props: {setApproveModal: (a: boolean) => void}) {
    return (
      <div onClick = {() => {props.setApproveModal(false); }} className = 'modalBackground'>
        <div style = {{textAlign: 'center'}} className = 'modalContainer'>
          <div style = {{paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <span style = {{paddingBottom: '60px', fontWeight: '600', fontSize: '20px'}}>Approve</span>
            <button className = 'modalClose' onClick = {() => props.setApproveModal(false)}>&times;</button>
          </div>
          <div style = {{paddingBottom: '20px', paddingLeft: '85px'}}>
            <img id = "approvalpic" className = "Approving" src = {PendingApproval} alt = "approving"/>
          </div>
          <p id = 'approvingStatus' style = {{margin: 'auto'}}>
            Approving...
          </p>
        </div>
      </div>
    )
  }