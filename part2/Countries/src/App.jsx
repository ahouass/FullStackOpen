import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Country from './components/Country';

function App() {
  const [searchCountry, setSearchCountry] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
          .then(res => {
            setCountries(res.data)
          })
  },[])

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(searchCountry.toLowerCase()))

  return (
    <div>
      <label>find countries </label>
      <input value={searchCountry} onChange={(e) => setSearchCountry(e.target.value)}></input>
      <Country countriesToShow={countriesToShow}/>
    </div>
  )
}

export default App
