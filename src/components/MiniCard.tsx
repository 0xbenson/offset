export function MiniCard(props: {title: string, symbol: any, amount: string, subtitle: string}) {
    return (
      <div className = 'MiniCard'>
        <img className = 'CardSymbol' src = {props.symbol} alt = ""></img>
        <span style = {{verticalAlign: 'top'}}>{props.title}</span>
        <p className = 'bigNumber'>{props.amount}</p>
        <span className = "BCTburned">{props.subtitle}</span>
      </div>
    )
  }