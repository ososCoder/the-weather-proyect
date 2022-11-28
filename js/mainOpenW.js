//OPEN WEATHER KEY/////////////////////////////////////////////////////////////////////////////////////////////////////////
const KEY = '7e44fe40f6070e033fef8c5210183815';

//API CALL URL/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key} --> forecast
//http://api.openweathermap.org/geo/1.0/direct?q=${municipio}&limit=1&appid=${KEY} --> geocoding
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key} --> current weather

//API WEATHER CALL (current)///////////////////////////////////////////////////////////////////////////////////////////////
const getCurrentWeather = async (latitude, longitude, name) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=${KEY}`
    );
    const data = await response.json();
    //llamada a renderActualWeather
    renderActualWeather(data, name);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

//API WEATHER CALL (forecast)//////////////////////////////////////////////////////////////////////////////////////////////
const getForecastWeather = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=${KEY}`
    );
    const data = await response.json();
  } catch (err) {
    console.error(err);
  }
};

//GEOCODING CALL///////////////////////////////////////////////////////////////////////////////////////////////////////////
const apiCallGeocoding = async (municipio) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${municipio}&limit=5&appid=${KEY}`
    );
    const data = await response.json();
    console.log(data);

    //checkeo de country === ES
    for (const checkES of data) {
      //si el país es España destructuring
      if (checkES.country === 'ES') {
        const { lat, lon, name } = checkES;
        //llamada a la función con los argumentos latitude ,longitude y name
        await getCurrentWeather(lat, lon, name);
        break;
      } else {
        throw new Error('Municipio no encontrado'); //--> se puede armar función para mostrar error
      }
    }
  } catch (err) {
    console.error(err);
  }
};

//SEARCH//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//selección del input y del search
const form = document.forms.form;
const search = document.querySelector('.search');

//render current weather
search.addEventListener('click', () => {
  const inputValue = form.elements.input.value;
  apiCallGeocoding(inputValue);
  form.elements.input.value = '';
});

//RENDER ACTUAL WEATHER///////////////////////////////////////////////////////////////////////////////////////////////////
const renderActualWeather = (data, name) => {
  const sectionWeatherNow = document.querySelector('.weatherNow');
  sectionWeatherNow.innerHTML = '';

  //municipio
  const municipioName = name;
  console.log(municipioName);

  //weather
  const weather = data.weather[0].description;

  //temperaturas
  const actualTemp = Math.round(data.main.temp);
  const maxTemp = Math.round(data.main.temp_max);
  const minTemp = Math.round(data.main.temp_min);

  //amanecer / anochecer
  const sunriseHours = new Date(data.sys.sunrise * 1000)
    .getHours()
    .toLocaleString();
  const sunriseMinutes = new Date(data.sys.sunrise * 1000)
    .getMinutes()
    .toLocaleString();
  const sunrise = sunriseHours + ':' + sunriseMinutes.padEnd(2, '0');

  const sunsetHours = new Date(data.sys.sunset * 1000)
    .getHours()
    .toLocaleString();
  const sunsetMinutes = new Date(data.sys.sunset * 1000)
    .getMinutes()
    .toLocaleString();
  const sunset = sunsetHours + ':' + sunsetMinutes.padEnd(2, '0');

  //pusheo al section weather now
  sectionWeatherNow.innerHTML = `
  <div class="skyState">
    <h3>${municipioName}</h3>
    <h3>${weather}</h3>
  </div>
  <div class="actualTemp">
    <h3>Ahora</h3>
    <h3>${actualTemp}ºC</h3>
  </div>
  <div class="maxTemp">
    <img src="/css/icons/temperature-high.svg" alt="maxima temperatura" />
    <h3>${maxTemp}ºC</h3>
  </div>
  <div class="minTemp">
    <img src="/css/icons/temperature-low.svg" alt="minima temperatura" />
    <h3>${minTemp}ºC</h3>
  </div>
  <div class="sunrise">
    <img src="/css/icons/sunrise.png" alt="amanecer" />
    <h3>${sunrise}</h3>
  </div>
  <div class="sunset">
    <img src="/css/icons/sunset.png" alt="anochecer" />
    <h3>${sunset}</h3>
  </div>
  `;
};
