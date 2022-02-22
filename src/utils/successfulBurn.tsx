import ApprovalCheck from '../assets/approvingCheck.png';

export function successfulBurn() {
    (document.getElementById("burnSymbol") as HTMLImageElement).src='#';
    (document.getElementById("approvalpic") as HTMLImageElement).src=ApprovalCheck;
    document.getElementById("approvalpic").classList.add('ApproveOutcome');
    document.getElementById("approvalpic").classList.remove('Approving');
    document.getElementById("approvingStatus").textContent = 'Burned!'
  }