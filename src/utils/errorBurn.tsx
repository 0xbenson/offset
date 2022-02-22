import ApprovalX from '../assets/approvingX.png';

export function errorBurn() {
    (document.getElementById("burnSymbol") as HTMLImageElement).src='#';
    (document.getElementById("approvalpic") as HTMLImageElement).src=ApprovalX;
    document.getElementById("approvalpic").classList.add('ApproveOutcome');
    document.getElementById("approvalpic").classList.remove('Approving');
    document.getElementById("approvingStatus").textContent = 'Error.'
  }