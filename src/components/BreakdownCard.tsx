import Cloud from '../assets/cloud.png';
import MCO2 from '../assets/MCO2.png';

export function BreakdownCard(props: {logo: any, amount: string, subtitle: string}) {
    function RetirementInfo(props: {logo: any, amount: string, subtitle: string}) {
      return (
        <div>
          <p style = {{fontSize: '14px', fontWeight: '400'}}>Retired</p>
          <div style = {{justifyContent: 'start', display: 'flex'}}>
            <img className = 'CircleLogo' src = {props.logo} alt = 'BCTlogo'/>
            <div>
              <span style = {{lineHeight: '48px'}} className = 'bigNumber'>{props.amount}</span>
              <div><span className = 'BCTburned'>{props.subtitle}</span></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className = 'BreakdownCard'>
        <img style = {{marginRight: '11px', height: '30px', marginBottom: '5%'}} src = {Cloud} alt = "cloud"></img>
        <span style = {{verticalAlign: 'top'}}>Breakdown</span>
        <div>
          <RetirementInfo logo = {props.logo} amount = {props.amount} subtitle = {props.subtitle}/>
          <hr style = {{margin: '5% 0'}} />
          <RetirementInfo logo = {MCO2} amount = '0.000' subtitle = 'MCO2'/>
        </div>
      </div>
    )
  }