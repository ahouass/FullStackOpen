import { useState } from 'react'

const StatisticLine = (props) => {
  const {text, value} = props

  return (
    <tr>
      <td>{text}</td>
      <td>{text === 'positive' ? `${value} %` : value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad, total } = props

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total" value={total} />
          <StatisticLine text="average" value={(good - bad) / total || 0} />
          <StatisticLine text="positive" value={(good / total || 0) * 100} />
        </tbody>
      </table>
    </div>
  )
}

const Button = (props) => {
  const {onClick, text} = props
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
  }

  const handleBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text='good'/>
      <Button onClick={handleNeutral} text='neutral'/>
      <Button onClick={handleBad} text='bad'/>
      <h1>statistics</h1>
      {total === 0 ? <p>No feedback given</p> : <Statistics good={good} neutral={neutral} bad={bad} total={total} />}
    </div>
  )
}





export default App


