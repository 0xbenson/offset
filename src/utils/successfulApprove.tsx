import ApprovalCheck from '../assets/approvingCheck.png';

export function successfulApprove() {
    (document.getElementById("approvalpic") as HTMLImageElement).src=ApprovalCheck;
    document.getElementById("approvalpic").classList.add('ApproveOutcome');
    document.getElementById("approvalpic").classList.remove('Approving');
    document.getElementById("approvingStatus").textContent = 'Transaction Submitted!'
}