import PendingApproval from '../assets/approving.png';

export function ApproveModal(props: {setApproveModal: (a: boolean) => void}) {
    return (
      <div onClick = {() => {props.setApproveModal(false); }} className = 'modalBackground'>
        <div className = 'modalContainer'>
          <div className = 'modalHeader'>
            <span className = 'CardTitle'>Approve</span>
            <button className = 'modalClose' onClick = {() => props.setApproveModal(false)}>&times;</button>
          </div>
          <div className = 'loading'>
            <img id = "approvalpic" className = "Approving" src = {PendingApproval} alt = "approving"/>
          </div>
          <p id = 'approvingStatus' style = {{margin: 'auto'}}>
            Approving...
          </p>
        </div>
      </div>
    )
  }