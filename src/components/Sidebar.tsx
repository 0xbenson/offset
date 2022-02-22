import KLIMAlogo from '../assets/logo.png';

export function Sidebar(props: {address: string}) {
    return (
      <div className="Sidebar">
        <a rel="noreferrer" target="_blank" style = {{textDecoration: 'none'}} href="http://www.klimadao.finance/">
          <button style = {{backgroundColor: 'transparent', border: 'none', paddingBottom: '10px', display: 'flex'}} >
            <img src={KLIMAlogo} alt="KLIMA" className = "Logo"/>
            <header className = "LogoFont">
              KlimaDAO
            </header>
          </button>
        </a>
        <hr/>
        <header className = "YourAddress">
          Your Wallet Address:
        </header>
        <header className = "Address">
          {props.address === 'NOT CONNECTED' ? props.address : props.address.substring(0,4) + '...' + props.address.substring(props.address.length - 4)}
        </header>
        <hr/>
      </div>
    )
  }