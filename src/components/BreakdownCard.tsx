import Cloud from '../assets/cloud.png';

export function BreakdownCard(props: {carbonTypes: {logo: string, amount: number, subtitle: string}[]}) {
    function RetirementInfo(props: {logo: string, amount: string, subtitle: string}) {
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
    const carbonTypesList = props.carbonTypes.map((item, index) => (
      <div key = {index}>
        <RetirementInfo logo = {item.logo} amount = {item.amount.toFixed(3)} subtitle = {item.subtitle}/>
        {index < props.carbonTypes.length - 1 && <hr style = {{margin: '5% 0'}} />}
      </div>
    ));

    return (
      <div className = 'BreakdownCard'>
        <img className = 'CardSymbol' src = {Cloud} alt = "cloud"></img>
        <span style = {{verticalAlign: 'top'}}>Breakdown</span>
        <div>
          {carbonTypesList}
        </div>
      </div>
    )
  }