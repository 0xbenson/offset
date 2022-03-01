import './App.css';
import React, {useState, useEffect } from 'react';
import { ethers } from 'ethers';

//assets
import Arrow from './assets/arrow.png';
import Leaf from './assets/leaf.png';
import BCTcircle from './assets/BCTcircle.png';
import BCTbox from './assets/BCTbox.png';
import MCO2box from './assets/MCO2box.png';
import USDCbox from './assets/USDCbox.png';
import KLIMAbox from './assets/KLIMAbox.png';
import MCO2 from './assets/MCO2.png';

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
  KLIMAcontract,
  sKLIMAcontract,
  wsKLIMAcontract,
  BCTcontract,
  USDCcontract,
  MCO2contractAddress,
  MCO2abi,
  MCO2contract,
  retirementStorageContract,
  web3,
  offsetConsumptionContract,
} from './contracts';

//components
import { InputField } from './components/InputField';
import { MiniCard } from './components/MiniCard';
import { Sidebar } from './components/Sidebar';
import { ConversionPanel } from './components/ConversionPanel';
import { BreakdownCard } from './components/BreakdownCard';
import { Toast } from './components/Toast';
import { BurnModal } from './components/burnModal';
import { ApproveModal } from './components/ApproveModal';
import { CoinModal } from './components/CoinModal';
import { CarbonModal } from './components/CarbonModal';
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
  const [carbonModalOpened, setCarbonModalOpened] = useState(false);
  const [toastOpened, setToastOpened] = useState(false);
  const [currentCoin, setCurrentCoin] = useState('USDC');
  const [KLIMAapproved, setKLIMAapproved] = useState(false);
  const [sKLIMAapproved, setsKLIMAapproved] = useState(false);
  const [wsKLIMAapproved, setwsKLIMAapproved] = useState(false);
  const [USDCapproved, setUSDCapproved] = useState(false);
  const [BCTapproved, setBCTapproved] = useState(false);
  const [MCO2approved, setMCO2approved] = useState(false);
  const [MCO2balance, setMCO2balance] = useState(0);
  const [approveModalOpened, setApproveModalOpened] = useState(false);
  const [KLIMAbalance, setKLIMAbalance] = useState(0);
  const [sKLIMAbalance, setsKLIMAbalance] = useState(0);
  const [wsKLIMAbalance, setwsKLIMAbalance] = useState(0);
  const [BCTbalance, setBCTbalance] = useState(0);
  const [USDCbalance, setUSDCbalance] = useState(0);
  const [totalCarbonRetired, setTotalCarbonRetired] = useState(0);
  const [totalOffsetTransactions, setTotalOffsetTransactions] = useState(0);
  const [BCTretired, setBCTretired] = useState(0);
  const [MCO2retired, setMCO2retired] = useState(0);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [poolToken, setPoolToken] = useState(BCTcontractAddress);
  const [sourceToken, setSourceToken] = useState(USDCcontractAddress);
  const [currentCarbonType, setCurrentCarbonType] = useState('BCT');

  useEffect(() => {
      window.addEventListener('resize', () => setWidth(window.innerWidth) );
      return () => {
          window.removeEventListener('resize', () => setWidth(window.innerWidth) );
      }
  }, []);

  function CoinSelectButton(props: {title: string, openModal: (a: boolean) => void, coin: string}) {
    const logo = props.coin === 'BCT' ? BCTbox : props.coin === 'MCO2' ? MCO2box : props.coin === 'MCO2' ? MCO2box : props.coin === 'USDC' ? USDCbox : KLIMAbox
    return (
      <div>
        <p className = "inputTitle">{props.title}</p>
        <button className = 'CoinSelection' onClick = { !active ? null : () => { props.openModal(true); }}>
          <div className = 'infoPair'>
            <img className = 'coinBox' src = {logo} alt = 'coinLogo' />
            <span>{props.coin}</span>
          </div>
          <div className = 'infoPair'>
            <span className = "inputTitle">{ !active ? 'Not Connected' : 'Balance: ' + currentCoinBalance().toFixed(5) + ' ' + props.coin }</span>
            <img src = {Arrow} style = {{width: '12px', paddingLeft: '7px'}} alt = "dropdown"/>
          </div>
        </button>
        <p/>
      </div>
    )
  }

  function CarbonSelectButton(props: {title: string, openModal: (a: boolean) => void, carbonType: string}) {
    const logo = props.carbonType === 'BCT' ? BCTbox : MCO2box;
    return (
      <div>
        <p className = "inputTitle">{props.title}</p>
        <button className = 'CoinSelection' disabled = {props.carbonType === currentCoin} onClick = { !active ? null : () => { props.openModal(true); }}>
          <div className = 'infoPair'>
            <img src = {logo} className = 'coinBox' alt = 'coinLogo' />
            <span>{props.carbonType}</span>
          </div>
          <img src = {Arrow} style = {{width: '12px', paddingLeft: '7px'}} alt = "dropdown"/>
        </button>
        <p/>
      </div>
    )
  }

  function RetireAmountInput() {
    return (
      <div>
        <p className = "inputTitle">Amount in Carbon Tons</p>
        <input
          onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
          onChange = {(e) => {
            if (parseInt(e.target.value) === 0 || e.target.value === '') {
              (document.getElementById('BCTamount') as HTMLSpanElement).textContent = '0.00';
              (document.getElementById('convertedAmount') as HTMLSpanElement).textContent = '0.00';
              return;
            }
            offsetConsumptionContract.methods.getSourceAmount(sourceToken, poolToken, BigInt(e.target.value*10**18).toString(), true).call(function(err: Error, res: number) {
              if (err) {
                return;
              }
              (document.getElementById('BCTamount') as HTMLSpanElement).textContent = (+e.target.value).toFixed(2);
              (document.getElementById('convertedAmount') as HTMLSpanElement).textContent = (res[0]/(10**18)).toFixed(2).toString();
            });
          }}
          id = 'amount'
          type="number"
          placeholder="How many carbon tons would you like to retire?"
        />
        <button onClick = {() => {
          if (sourceToken === poolToken) {
            (document.getElementById('amount') as HTMLInputElement).value = (currentCoinBalance()*0.99).toFixed(5)
            return;
          }

          offsetConsumptionContract.methods.getSourceAmount(sourceToken, poolToken, BigInt(currentCoinBalance()*10**18).toString(), false).call(function(err: Error, res: number) {
            if (err) {
              return;
            }
            (document.getElementById('amount') as HTMLInputElement).value = (res[1]/(10**18)*0.99).toFixed(5);
              (document.getElementById('BCTamount') as HTMLSpanElement).textContent = (res[1]/(10**18)*0.99).toFixed(2);
              (document.getElementById('convertedAmount') as HTMLSpanElement).textContent = currentCoinBalance().toFixed(2);
          });
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
        connect();
        return;
      }
      if (currentCoinApproved()) {
        const amount = (document.getElementById('amount') as HTMLInputElement).value;
        const beneficiaryAddress = (document.getElementById('beneficiaryAddress') as HTMLInputElement).value;
        const beneficiary = (document.getElementById('beneficiary') as HTMLInputElement).value
        const retirementMessage = (document.getElementById('retirementMessage') as HTMLInputElement).value + ' Retired via KlimaDAO';
        burnCoin(amount, beneficiaryAddress, beneficiary, retirementMessage);
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
          return;
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

      MCO2contract.methods.allowance(accounts[0], offsetConsumptionAddress).call(function (err: Error, res: any) {
        if (err) {
          return;
        }
        if (res === '0') {
          setMCO2approved(false);
          return;
        }
        setMCO2approved(true);
      });
      
      sKLIMAcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setsKLIMAbalance(res/(10**9));
      });

      KLIMAcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setKLIMAbalance(res/(10**9));
      });

      wsKLIMAcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setwsKLIMAbalance(res/(10**18)); 
      });

      BCTcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setBCTbalance(res/(10**18));
      });

      USDCcontract.methods.balanceOf(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setUSDCbalance(res/(10**18));
      });

      MCO2contract.methods.balanceOf(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setMCO2balance(res/(10**18));
      });

      retirementStorageContract.methods.getRetirementTotals(accounts[0]).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setTotalCarbonRetired(res[1]/(10**18));
        setTotalOffsetTransactions(res[0])
      });

      retirementStorageContract.methods.getRetirementPoolInfo(accounts[0], BCTcontractAddress).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setBCTretired(res/(10**18));
      });

      retirementStorageContract.methods.getRetirementPoolInfo(accounts[0], MCO2contractAddress).call(function (err: Error, res: number) {
        if (err) {
          return;
        }
        setMCO2retired(res/(10**18));
      });

      
    }
  }

  async function approveCoin(coin: string) {
    setApproveModalOpened(true);
    const con: [string, any] = coin === 'BCT' ? [BCTcontractAddress, BCTabi] : coin === 'MCO2' ? [MCO2contractAddress, MCO2abi] : coin === 'USDC' ? [USDCcontractAddress, USDCabi] : coin === 'KLIMA' ? [KLIMAcontractAddress, KLIMAabi] : coin === 'sKLIMA' ? [sKLIMAcontractAddress, sKLIMAabi] : [wsKLIMAcontractAddress, wsKLIMAabi];
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

  async function burnCoin(amt: any, beneficiaryAddress: string, beneficiary: string, retirementMessage: string) {
    if (beneficiaryAddress === '') {
      beneficiaryAddress = address;
    }
    else if (!web3.utils.isAddress(beneficiaryAddress)) {
      setToastOpened(true);
      setTimeout(() => setToastOpened(false), 3000);
      return;
    }

    setBurnModalOpened(true);
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(offsetConsumptionAddress, offsetConsumptionABI, signer);

    erc20.retireCarbon(sourceToken, poolToken, BigInt(amt*10**18).toString(), true, beneficiaryAddress, beneficiary, retirementMessage).then(() => {
      successfulBurn();
      setTimeout(() => setBurnModalOpened(false), 2000);
    }).catch((err: Error) => {
      console.log(err);
      errorBurn();
      setTimeout(() => setBurnModalOpened(false), 2000);
    });

  }

  function currentCoinBalance() {
    return currentCoin === 'BCT' ? BCTbalance : currentCoin === 'MCO2' ? MCO2balance : currentCoin === 'USDC' ? USDCbalance : currentCoin === 'KLIMA' ? KLIMAbalance : currentCoin === 'sKLIMA' ? sKLIMAbalance : wsKLIMAbalance;
  }

  function currentCoinApproved() {
    return currentCoin === 'BCT' ? BCTapproved : currentCoin === 'MCO2' ? MCO2approved : currentCoin === 'USDC' ? USDCapproved : currentCoin === 'KLIMA' ? KLIMAapproved : currentCoin === 'sKLIMA' ? sKLIMAapproved : wsKLIMAapproved;
  }

  function MainPanel() {
    return (
      <div className = "Main">
        <div className = "HeaderPanel">
          <header className = "CardTitle">
            Carbon Offset
          </header>
          {active ? <button onClick={connect} className = "DisconnectButton">DISCONNECT</button> : <button onClick={connect} className = "ConnectButton">CONNECT</button>}
        </div>
        <div className = 'MainBody'>
          <div className = 'Card'>
            <p className = 'CardTitle'>Retire Carbon</p>
            <p className = 'CardSub'>
              Retire carbon and claim the underlying
              enviromental benefit of the carbon offset.<br/>
            </p>
            <div className = 'BurnPanel'>
              <CarbonSelectButton title = 'SELECT CARBON OFFSET TOKEN TO RETIRE' openModal = {setCarbonModalOpened} carbonType = {currentCarbonType}/>
              <CoinSelectButton title = 'SELECT INPUT TOKEN' openModal = {setCoinModalOpened} coin = {currentCoin}/>
              <RetireAmountInput/>
              <ConversionPanel currentCarbonType = {currentCarbonType} currentCoin = {currentCoin}/>
              <InputField title = "BENEFICIARY" type = "text" placeholder = "Who is the beneficiary?" id = "beneficiary"/>
              <InputField title = "BENEFICIARY ADDRESS (optional; defaults to connected address)" type = "text" placeholder = "Which address are you retiring on behalf of?" id = "beneficiaryAddress"/>
              <InputField title = "RETIREMENT MESSAGE (optional)" type = "text" placeholder = "Any additional info for your retirement?" id = "retirementMessage"/>
              <MainPanelButton/>
            </div>
          </div>
          <div className = 'CardStacks'>
            <MiniCard title = "You've Retired" symbol = {Leaf} amount = {totalCarbonRetired.toFixed(3)} subtitle = "Tons of Carbon Retired"/>
            <MiniCard title = "You've Offset" symbol = {Leaf} amount = {totalOffsetTransactions} subtitle = "Total Offset Transactions"/>
            <BreakdownCard carbonTypes = {[{logo: BCTcircle, amount: BCTretired, subtitle: 'BCT'}, {logo: MCO2, amount: MCO2retired, subtitle: 'MCO2'}]}/>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {width > 1200 && <Sidebar address = {address}/>}
      <MainPanel/>
      {carbonModalOpened && <CarbonModal currentCarbonType = {currentCarbonType} setModal = {setCarbonModalOpened} setPoolToken = {setPoolToken} setCurrentCarbonType = {setCurrentCarbonType} />}
      {coinModalOpened && <CoinModal currentCoin = {currentCoin} setModalOpen = {setCoinModalOpened} setSourceToken = {setSourceToken} setCurrentCoin = {setCurrentCoin} MCO2balance = {MCO2balance} BCTbalance = {BCTbalance} USDCbalance = {USDCbalance} KLIMAbalance = {KLIMAbalance} sKLIMAbalance = {sKLIMAbalance} wsKLIMAbalance = {wsKLIMAbalance} setPoolToken = {setPoolToken} setCarbonType = {setCurrentCarbonType}/>}
      {approveModalOpened && <ApproveModal setApproveModal= {setApproveModalOpened}/>}
      {burnModalOpened && <BurnModal setBurnModal = {setBurnModalOpened}/>}
      {toastOpened && <Toast/>}
    </div>
  );
}

export default App;