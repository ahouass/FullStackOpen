import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

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
      <div>
        {/* Too many results */}
        {countriesToShow.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {countriesToShow.length <= 10 && countriesToShow.map(country =>
          <p key={country.cca3}>{country.name.common}</p>
        )}

        {countriesToShow.length === 1 && countriesToShow.map(country =>
          <>
            <h1 key={country.cca3}>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>Languages</h3>
          </>
        )}
      </div>
    </div>
  )
}

export default App
