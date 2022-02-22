import ApprovalX from '../assets/approvingX.png';

export function errorApprove() {
    (document.getElementById("approvalpic") as HTMLImageElement).src=ApprovalX;
    document.getElementById("approvalpic").classList.add('ApproveOutcome');
    document.getElementById("approvalpic").classList.remove('Approving');
    document.getElementById("approvingStatus").textContent = 'Declined.'
}