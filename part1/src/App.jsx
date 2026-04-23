
const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercise}
    </p>
  )
}

const Content = (props) => {
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14

  return (
    <div>
      <Part part={part1} exercise={exercises1}/>
      <Part part={part2} exercise={exercises2}/>
      <Part part={part3} exercise={exercises3}/>
      <Total   Total={exercises1 + exercises2 + exercises3}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.Total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'


  return (
    <div>
      <Header  course={course}/>
      <Content/>
    </div>
  )
}

export default App
