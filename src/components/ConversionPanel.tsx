import BCTlogo from '../assets/BCT.png';
import USDClogo from '../assets/USDC.png';
import KLIMAlogo from '../assets/logo.png';

export function ConversionPanel(props: {currentCoin: string}) {
    function CoinPanel(props: {coin: string, id: string}) {
      return (
        <div className = 'Conversion'>
          <div style = {{display: 'flex'}}>
            <div style = {{marginTop: '6px', marginLeft: '7px'}} className = { props.coin === 'BCT' ? 'BCTcoinBox' : props.coin === 'USDC' ? 'USDCcoinBox' : 'KLIMAcoinBox' }>
              <img style = { props.coin === 'BCT' ? {paddingTop: '12px', paddingLeft: '15px'} : props.coin === 'USDC' ? {paddingTop: '5px', paddingLeft: '5px'} : {height: '30px', paddingTop: '9px', paddingLeft: '9px'}} src={ props.coin === 'BCT' ? BCTlogo : props.coin === 'USDC' ? USDClogo : KLIMAlogo } alt="Logo" />
            </div>
            <span id = {props.id} style = {{paddingLeft: '14px', paddingTop: '17px'}}>0</span>
          </div>
        </div>
      )
    }

    return (
      <div>
        <p className = "inputTitle">CONVERSION</p>
        <div style = {{display: 'flex', justifyContent: 'space-between'}}>
          <CoinPanel coin = 'BCT' id = 'nbx'/>
          <span style = {{paddingTop: '17px', fontSize: '30px'}}>⇆</span>
          <CoinPanel coin = {props.currentCoin} id = 'BCTequivalent'/>
        </div>
        <p/>
      </div>
    )
  }