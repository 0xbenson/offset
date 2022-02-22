import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Result } from 'ethers/lib/utils';

//assets
import KLIMAlogo from './assets/logo.png';
import Arrow from './assets/arrow.png';
import Fire from './assets/fire.png';
import BCTlogo from './assets/BCT.png';
import USDClogo from './assets/USDC.png';
import PendingApproval from './assets/approving.png';
import Leaf from './assets/leaf.png';

//contracts
import {sKLIMAcontractAddress,
  sKLIMAabi,
  KLIMAcontractAddress,
  KLIMAabi,
  wsKLIMAcontractAddress,
  wsKLIMAabi,
  USDCcontractAddress,
  USDCabi,
  BCTcontractAddress,
  BCTabi,
  offsetConsumptionAddress,
  offsetConsumptionABI,
  approve_amount,
  BCTklimaPool,
  BCTusdcPool,
  KLIMAcontract,
  sKLIMAcontract,
  wsKLIMAcontract,
  BCTcontract,
  USDCcontract,
  web3
} from './contracts';

//components
import { InputField } from './components/InputField';
import { MiniCard } from './components/MiniCard';
import { Sidebar } from './components/Sidebar';
import { ConversionPanel } from './components/ConversionPanel';
import { BreakdownCard } from './components/BreakdownCard';
import { Toast } from './components/Toast';

//utils
import { errorBurn } from './utils/errorBurn';
import { successfulBurn } from './utils/successfulBurn';
import { successfulApprove } from './utils/successfulApprove';
import { errorApprove } from './utils/errorApprove';

function App() {
  const [address, setAddress] = useState('NOT CONNECTED');
  const [active, setActive] = useState(false);
  const [coinModalOpened, setCoinModalOpened] = useState(false);
  const [burnModalOpened, setBurnModalOpened] = useState(false);
  const [toastOpened, setToastOpened] = useState(false);
  const [currentCoin, setCurrentCoin] = useState('BCT');
  const [KLIMAapproved, setKLIMAapproved] = useState(false);
  const [sKLIMAapproved, setsKLIMAapproved] = useState(false);
  const [wsKLIMAapproved, setwsKLIMAapproved] = useState(false);
  const [USDCapproved, setUSDCapproved] = useState(false);
  const [BCTapproved, setBCTapproved] = useState(false);
  const [approveModalOpened, setApproveModalOpened] = useState(false);
  const [KLIMAbalance, setKLIMAbalance] = useState(0);
  const [sKLIMAbalance, setsKLIMAbalance] = useState(0);
  const [wsKLIMAbalance, setwsKLIMAbalance] = useState(0);
  const [BCTbalance, setBCTbalance] = useState(0);
  const [USDCbalance, setUSDCbalance] = useState(0);
  const [BCTperUSDC, setBCTperUSDC] = useState(0);
  const [BCTperKLIMA, setBCTperKLIMA] = useState(0);
  const [BCTperWSKLIMA, setBCTperWSKLIMA] = useState(0);

  Promise.allSettled([BCTcontract.methods.balanceOf(BCTklimaPool).call(), KLIMAcontract.methods.balanceOf(BCTklimaPool).call(), BCTcontract.methods.balanceOf(BCTusdcPool).call(), USDCcontract.methods.balanceOf(BCTusdcPool).call(), sKLIMAcontract.methods.index().call()]).then((results: any) => {
    const BCTinKpool = (+results[0].value)*10**-18;
    const KinKpool = (+results[1].value)*10**-9;
    setBCTperKLIMA(KinKpool/BCTinKpool);
    const BCTinUpool = (+results[2].value)*(10**-18);
    const UinUpool = (+results[3].value)*(10**-6);
    setBCTperUSDC(UinUpool/BCTinUpool);
    const klimaIndex = (+results[4].value)*10**-9;
    setBCTperWSKLIMA(KinKpool/(BCTinKpool*klimaIndex))
  }).catch((err:any) => {
    console.log(err);
  });
  
  function CoinSelectButton() {
    return (
      <div>
        <p className = "inputTitle">SELECT TOKEN</p>
        <button className = 'CoinSelection' onClick = { !active ? null : () => { setCoinModalOpened(true); }}>
        <div style = {{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'fit-content'}}>
          <div className = { currentCoin === 'BCT' ? 'BCTcoinBox' : currentCoin === 'USDC' ? 'USDCcoinBox' : 'KLIMAcoinBox' }>
            <img style = { currentCoin === 'BCT' ? {paddingTop: '12px'} : currentCoin === 'USDC' ? {paddingTop: '5px'} : {height: '30px', paddingTop: '9px'}} src={ currentCoin === 'BCT' ? BCTlogo : currentCoin === 'USDC' ? USDClogo : KLIMAlogo } alt="Logo" />
          </div>
          <span style = {{paddingLeft: '7px'}}>{currentCoin}</span>
        </div>
        <div style = {{width: 'fit-content', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
          <span className = "inputTitle">{ !active ? 'Not Connected' : 'Balance: ' + currentCoinBalance().toFixed(5) + ' ' + currentCoin }</span>
          <img src = {Arrow} style = {{width: '12px', paddingLeft: '7px'}} alt = "dropdown"/>
        </div>
        </button>
        <p/>
      </div>
    )
  }

  function RetireAmountInput() {
    const multiplier = currentCoin === 'KLIMA' || currentCoin === 'sKLIMA' ? BCTperKLIMA : currentCoin === 'BCT' ? 1 : currentCoin === 'USDC' ? BCTperUSDC : BCTperWSKLIMA;
    return (
      <div>
        <p className = "inputTitle">BCT Amount</p>
        <input
          onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
          onChange = {(e) => {
            (document.getElementById('nbx') as HTMLSpanElement).textContent = (+e.target.value).toFixed(2);
            (document.getElementById('BCTequivalent') as HTMLSpanElement).textContent = (multiplier*+e.target.value).toFixed(2).toString();
          }}
          id = 'amount'
          type="number"
          placeholder="How many BCT would you like to retire?"
        />
        <button onClick = {() => {
          (document.getElementById('amount') as HTMLInputElement).value = currentCoinBalance().toString();
          (document.getElementById('nbx') as HTMLSpanElement).textContent = currentCoinBalance().toFixed(2).toString();
          (document.getElementById('BCTequivalent') as HTMLSpanElement).textContent = (multiplier*currentCoinBalance()).toFixed(2).toString();
        }}
        className = 'Max'>
        MAX
        </button>
        <p/>
      </div>
    )
  }

  function MainPanelButton() {
    function action() {
      if (!active) {
        return;
      }
      if (currentCoinApproved()) {
        const amount = (document.getElementById('amount') as HTMLInputElement).value;
        const beneficiaryAddress = (document.getElementById('beneficiaryAddress') as HTMLInputElement).value;
        const beneficiary = (document.getElementById('beneficiary') as HTMLInputElement).value
        const retirementMessage = (document.getElementById('retirementMessage') as HTMLInputElement).value;
        burnCoin(currentCoin, amount, beneficiaryAddress, beneficiary, retirementMessage);
      }
      else {
        approveCoin(currentCoin);
      }
    }
    
    return (
      <button
        onClick = { () => action() }
        className = 'burn'>
        { active ? currentCoinApproved() ? 'BURN' : 'APPROVE' : 'CONNECT WALLET'}
      </button>
    )
  }

  function CoinModal() {
    return (
      <div onClick = {() => {setCoinModalOpened(false); }} className = 'modalBackground'>
        <div className = 'modalContainer'>
          <div style = {{paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <span style = {{fontWeight: '600', fontSize: '20px'}}>Select Token</span>
            <button className = 'modalClose' onClick = {() => setCoinModalOpened(false)}>&times;</button>
          </div>
          <div>
            <button style = {{backgroundColor: currentCoin === 'BCT' ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {setCurrentCoin('BCT'); setCoinModalOpened(false); }}>
              <div className = 'BCTcoinBox'>
                <img style = {{paddingTop: '12px'}} src={BCTlogo} alt="BCT" />
              </div>
              <div className = 'coinDetails'>
                <div className = 'coinName'>BCT</div>
                <div className = 'coinBalance'>{BCTbalance.toFixed(4) + ' BCT'}</div>
              </div>
            </button>
            <button style = {{backgroundColor: currentCoin === 'USDC' ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {setCurrentCoin('USDC'); setCoinModalOpened(false); }}>
              <div className = 'USDCcoinBox'>
                <img style = {{paddingTop: '6px'}} src={USDClogo} alt="USDC" />
              </div>
              <div className = 'coinDetails'>
                <div className = 'coinName'>USDC</div>
                <div className = 'coinBalance'>{USDCbalance.toFixed(4) + ' USDC'}</div>
              </div>
            </button>
            <button style = {{backgroundColor: currentCoin === 'KLIMA' ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {setCurrentCoin('KLIMA'); setCoinModalOpened(false); }}>
              <div className = 'KLIMAcoinBox'>
                <img style = {{paddingTop: '8px', height: '32px'}} src={KLIMAlogo} alt="KLIMA" />
              </div>
              <div className = 'coinDetails'>
                <div className = 'coinName'>KLIMA</div>
                <div className = 'coinBalance'>{KLIMAbalance.toFixed(4) + ' KLIMA'}</div>
              </div>
            </button>
            <button style = {{backgroundColor: currentCoin === 'sKLIMA' ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {setCurrentCoin('sKLIMA'); setCoinModalOpened(false); }}>
              <div className = 'KLIMAcoinBox'>
                <img style = {{paddingTop: '8px', height: '32px'}} src={KLIMAlogo} alt="KLIMA" />
              </div>
              <div className = 'coinDetails'>
                <div className = 'coinName'>sKLIMA</div>
                <div className = 'coinBalance'>{sKLIMAbalance.toFixed(4) + ' sKLIMA'}</div>
              </div>
            </button>
            <button style = {{backgroundColor: currentCoin === 'wsKLIMA' ? '#4A4A4A' : '#303030'}} className = 'selectCoinButton' onClick = {() => {setCurrentCoin('wsKLIMA'); setCoinModalOpened(false); }}>
              <div className = 'KLIMAcoinBox'>
                <img style = {{paddingTop: '8px', height: '32px'}} src={KLIMAlogo} alt="KLIMA" />
              </div>
              <div className = 'coinDetails'>
                <div className = 'coinName'>wsKLIMA</div>
                <div className = 'coinBalance'>{wsKLIMAbalance.toFixed(4) + ' wsKLIMA'}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  function ApproveModal() {
    return (
      <div onClick = {() => {setCoinModalOpened(false); }} className = 'modalBackground'>
        <div style = {{textAlign: 'center'}} className = 'modalContainer'>
          <div style = {{paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <span style = {{paddingBottom: '60px', fontWeight: '600', fontSize: '20px'}}>Approve</span>
            <button className = 'modalClose' onClick = {() => setApproveModalOpened(false)}>&times;</button>
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

  function BurnModal() {
    return (
      <div onClick = {() => {setBurnModalOpened(false); }} className = 'modalBackground'>
        <div style = {{textAlign: 'center'}} className = 'modalContainer'>
          <div style = {{paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <span style = {{paddingBottom: '60px', fontWeight: '600', fontSize: '20px'}}>Burn</span>
            <button className = 'modalClose' onClick = {() => setBurnModalOpened(false)}>&times;</button>
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

  async function connect() {
    if (active) {
      setAddress('NOT CONNECTED');
      setActive(false);
    }
    else if (typeof (window as any).ethereum != 'undefined') {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setActive(true);
      sKLIMAcontract.methods.allowance(accounts[0], offsetConsumptionAddress).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        if (res === '0') {
          setsKLIMAapproved(false);
          return;
        }
        setsKLIMAapproved(true);
      });
    
      KLIMAcontract.methods.allowance(accounts[0], offsetConsumptionAddress).call(function (err: Error, res: any) {
        if (err) {
          return
        }
        if (res === '0') {
          setKLIMAapproved(false);
          return;
        }
        setKLIMAapproved(true);
      });
    
      wsKLIMAcontract.methods.allowance(accounts[0], offsetConsumptionAddress).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        if (res === '0') {
          setwsKLIMAapproved(false);
          return;
        }
        setwsKLIMAapproved(true);
      });
    
      USDCcontract.methods.allowance(accounts[0], offsetConsumptionAddress).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        if (res === '0') {
          setUSDCapproved(false);
          return;
        }
        setUSDCapproved(true);
      });
    
      BCTcontract.methods.allowance(accounts[0], offsetConsumptionAddress).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        if (res === '0') {
          setBCTapproved(false);
          return;
        }
        setBCTapproved(true);
      });

      sKLIMAcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        setsKLIMAbalance(res/(10**9));
      });

      KLIMAcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        setKLIMAbalance(res/(10**9));
      });

      wsKLIMAcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        setwsKLIMAbalance(res/(10**18)); 
      });

      BCTcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        setBCTbalance(res/(10**18));
      });

      USDCcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        setUSDCbalance(res/(10**6));
      });
    }
  }

  async function approveCoin(coin: string) {
    setApproveModalOpened(true);
    const con: any[] = coin === 'BCT' ? [BCTcontractAddress, BCTabi] : coin === 'USDC' ? [USDCcontractAddress, USDCabi] : coin === 'KLIMA' ? [KLIMAcontractAddress, KLIMAabi] : coin === 'sKLIMA' ? [sKLIMAcontractAddress, sKLIMAabi] : [wsKLIMAcontractAddress, wsKLIMAabi];
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(con[0], con[1], signer);
    erc20.approve(offsetConsumptionAddress, approve_amount).then(() => {
      successfulApprove();
      setTimeout(() => setApproveModalOpened(false), 2000);
    }).catch((err: Error) => {
      errorApprove();
      setTimeout(() => setApproveModalOpened(false), 2000);
    });
    return;
  }

  async function burnCoin(coin: string, amt: any, beneficiaryAddress: string, beneficiary: string, retirementMessage: string) {
    if (beneficiaryAddress === '') {
      beneficiaryAddress = address;
    }
    else if (!web3.utils.isAddress(beneficiaryAddress)) {
      setToastOpened(true);
      setTimeout(() => setToastOpened(false), 3000);
      return;
    }

    setBurnModalOpened(true);
    try {
      const result = await axios.post(
        'https://api.thegraph.com/subgraphs/name/cujowolf/polygon-bridged-carbon',
        {
          query: `
          {
            carbonOffsets(first: 20, orderBy: klimaRanking, orderDirection: asc, where: {balanceBCT_gt: 0}) {
              tokenAddress
            }
          }
          `
        }
      );
      var addressList: any = [];
      result.data.data.carbonOffsets.forEach((item: any) => {
        addressList.push(item.tokenAddress);
      })

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(offsetConsumptionAddress, offsetConsumptionABI, signer);

      if (coin === 'BCT') {
        erc20.retireWithPool((amt*10**18).toString(), beneficiaryAddress, beneficiary, retirementMessage, addressList, BCTcontractAddress).then(() => {
          successfulBurn();
          setTimeout(() => setBurnModalOpened(false), 2000);
        }).catch((err: Error) => {
          errorBurn()
          setTimeout(() => setBurnModalOpened(false), 2000);
        });
        return;
      }

      if (coin === 'USDC') {
        erc20.retireWithUSDC((amt*10**18).toString(), beneficiaryAddress, beneficiary, retirementMessage, addressList, BCTcontractAddress).then(() => {
          successfulBurn();
          setTimeout(() => setBurnModalOpened(false), 2000);
        }).catch((err: Error) => {
          errorBurn()
          setTimeout(() => setBurnModalOpened(false), 2000);
        });
        return;
      }
      const KLIMAtype = coin === 'KLIMA' ? KLIMAcontractAddress : coin === 'sKLIMA' ? sKLIMAcontractAddress : wsKLIMAcontractAddress;
      erc20.retireWithKLIMA(KLIMAtype, (amt*10**18).toString(), beneficiaryAddress, beneficiary, retirementMessage, addressList, BCTcontractAddress).then((res: Result) => {
        successfulBurn();
        setTimeout(() => setBurnModalOpened(false), 2000);
      }).catch((err: Error) => {
        errorBurn()
        setTimeout(() => setBurnModalOpened(false), 2000);
      });

    } catch (error) {
      console.log(error);
    }
  }

  function currentCoinBalance() {
    return currentCoin === 'BCT' ? BCTbalance : currentCoin === 'USDC' ? USDCbalance : currentCoin === 'KLIMA' ? KLIMAbalance : currentCoin === 'sKLIMA' ? sKLIMAbalance : wsKLIMAbalance;
  }

  function currentCoinApproved() {
    return currentCoin === 'BCT' ? BCTapproved : currentCoin === 'USDC' ? USDCapproved : currentCoin === 'KLIMA' ? KLIMAapproved : currentCoin === 'sKLIMA' ? sKLIMAapproved : wsKLIMAapproved;
  }

  function MainPanel() {
    return (
      <div className = "Main">
        <div className = "HeaderPanel">
          <header className = "CardTitle">
            Carbon Offset (beta)
          </header>
          {active ? <button onClick={connect} className = "DisconnectButton">DISCONNECT</button> : <button onClick={connect} className = "ConnectButton">CONNECT</button>}
        </div>
        <div style = {{height: '95%', display: 'flex', justifyContent: 'space-between'}}>
          <div className = 'Card'>
            <p className = 'CardTitle'>Retire Carbon</p>
            <p className = 'CardSub'>Hold, stake, and compound. If the protocol earns a <br/> profit selling carbon bonds, these rewards are <br/>shared among all holders of sKLIMA.</p>
            <div className = 'BurnPanel'>
              <CoinSelectButton/>
              <RetireAmountInput/>
              <ConversionPanel currentCoin = {currentCoin}/>
              <InputField title = "BENEFICIARY" type = "text" placeholder = "Who is the beneficiary?" id = "beneficiary"/>
              <InputField title = "BENEFICIARY ADDRESS (optional)" type = "text" placeholder = "What address are you retiring on behalf of?" id = "beneficiaryAddress"/>
              <InputField title = "RETIREMENT MESSAGE (optional)" type = "text" placeholder = "Any additional info for your retirement?" id = "retirementMessage"/>
              <MainPanelButton/>
            </div>
          </div>
          <div style = {{flexDirection: 'column', display: 'flex', width: '30%'}}>
            <MiniCard title = "You've Retired" symbol = {Leaf} amount = "8,543" subtitle = "Offsets Retired"/>
            <MiniCard title = "Community Retired" symbol = {Leaf} amount = "478K" subtitle = "Total Offsets Retired"/>
            <BreakdownCard/>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="App">
      <Sidebar address = {address}/>
      <MainPanel/>
      {coinModalOpened && <CoinModal/>}
      {approveModalOpened && <ApproveModal/>}
      {burnModalOpened && <BurnModal/>}
      {toastOpened && <Toast/>}
    </div>
  );
}

export default App;