export function MiniCard(props: {title: string, symbol: any, amount: string, subtitle: string}) {
    return (
      <div className = 'MiniCard'>
        <img style = {{marginRight: '11px', height: '30px'}} src = {props.symbol} alt = ""></img>
        <span style = {{verticalAlign: 'top'}}>{props.title}</span>
        <p className = 'bigNumber'>{props.amount}</p>
        <span className = "BCTburned">{props.subtitle}</span>
      </div>
    )
  }