import BCTbox from '../assets/BCTbox.png';
import MCO2box from '../assets/MCO2box.png';
import USDCbox from '../assets/USDCbox.png';
import KLIMAbox from '../assets/KLIMAbox.png';

export function ConversionPanel(props: {currentCoin: string, currentCarbonType: string}) {
  const carbonLogo = props.currentCarbonType === 'BCT' ? BCTbox : MCO2box;
  const coinLogo = props.currentCoin === 'BCT' ? BCTbox : props.currentCoin === 'MCO2' ? MCO2box : props.currentCoin === 'USDC' ? USDCbox : KLIMAbox;
  function CoinPanel(props: {coin: string, id: string, logo: string}) {
    return (
      <div className = 'Conversion'>
        <img src = {props.logo} className = 'coinBox' alt = 'coinLogo' />
        <span id = {props.id}>0.00</span>
      </div>
    )
  }

  return (
    <div>
      <p className = "inputTitle">CONVERSION</p>
      <div style = {{display: 'flex', justifyContent: 'space-between'}}>
        <CoinPanel logo = {carbonLogo} coin = {props.currentCarbonType} id = 'BCTamount'/>
        <span style = {{paddingTop: '17px', fontSize: '30px'}}>⇆</span>
        <CoinPanel logo = {coinLogo} coin = {props.currentCoin} id = 'convertedAmount'/>
      </div>
      <p/>
    </div>
  )
}