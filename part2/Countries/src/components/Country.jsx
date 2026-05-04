import { useEffect, useState } from "react";

const Country = ({countriesToShow}) => {

  const [filteredCountry, setFilteredCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  const selectedCountry = filteredCountry ?? (countriesToShow.length === 1 ? countriesToShow[0] : null);
  const capitalName = selectedCountry?.capital?.[0] ?? "";

    const handleShowCountry = (name) => {
        const country = countriesToShow.find(country => 
            country.name.common === name
        );
        setFilteredCountry(country);
    }

  useEffect(() => {
    if (!capitalName || !apiKey) {
      setWeather(null);
      setWeatherError(null);
      return;
    }

    let cancelled = false;
    setWeather(null);
    setWeatherError(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capitalName)}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Weather request failed (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        if (!cancelled) {
          setWeather(data);
        }
      })
      .catch(error => {
        if (!cancelled) {
          setWeatherError(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [capitalName, apiKey]);

    if (selectedCountry) {
        return (
            <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>capital {selectedCountry.capital}</p>
          <p>area {selectedCountry.area}</p>
                <h3>Languages</h3>
                <ul>
            {Object.values(selectedCountry.languages).map(language =>
                        <li key={language}>{language}</li>
                    )}
                </ul>
          <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.common}`} />
                <br/>
          <h2>Weather in {capitalName}</h2>
          {!apiKey && (
            <p>Weather API key missing. Set VITE_WEATHER_KEY and restart the dev server.</p>
          )}
          {apiKey && !weather && !weatherError && (
            <p>Loading weather...</p>
          )}
          {weatherError && (
            <p>Weather unavailable: {weatherError}</p>
          )}
          {weather && (
            <div>
              <p>temperature {weather.main.temp} °C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>wind {weather.wind.speed} m/s</p>
            </div>
          )}
          {filteredCountry && (
            <button onClick={() => setFilteredCountry(null)}>Back to results</button>
          )}
            </div>
        );
    }


    return (
        <div>
        {/* Too many results */}
        {countriesToShow.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {countriesToShow.length <= 10 && countriesToShow.map(country => (
            <div key={country.cca3}>
                <label>{country.name.common}</label>
                <button onClick={() => handleShowCountry(country.name.common)}>Show</button>
                <br />
            </div>
        ))}

      </div>
    )
}

export default Country