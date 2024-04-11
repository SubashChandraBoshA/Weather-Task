const weatherAPIKey = "5ac57eb03527be29cf4e5cf39c46c1b9"; //Create your own API key From OpenWeather!
const h1 = document.createElement("h1");
const container = document.createElement("div");
container.setAttribute("id", "container");
container.classList.add("container");
document.body.appendChild(container);

h1.setAttribute("id", "title");
h1.setAttribute("class", "text-center");
h1.innerHTML = "WEB DEVELOPER TASK";
container.appendChild(h1);

const p = document.createElement("p");
p.setAttribute("id", "description");
p.innerHTML = "Restcountries & Weather using fetch API";
container.appendChild(p);

const cards = document.createElement("div");
cards.setAttribute("id", "cards");
cards.classList.add("row");
container.appendChild(cards);

const card = document.createElement("div");

// Fetching data from rest countries
async function getData() {
  const res = await fetch("https://restcountries.com/v3.1/all", {
    method: "GET",
  });
  const data = await res.json();
  renderAllCards(data);
}

// Reandering all cards
function renderAllCards(data) {
  data.map((val) => {
    cards.innerHTML += cardFun(val);
  });
  evenListenFun();
}

// Creating single card
function cardFun(cardData) {
  let root = cardData.idd.root;
  let capital;
  let suffixes;
  try {
    suffixes = cardData.idd.suffixes[0];
    capital = cardData.capital[0];
  } catch (error) {
    suffixes = "";
    root = "N/A";
    capital = "N/A";
    console.log(error);
  }
  return `
    <div class="col-sm-6 col-lg-4 col-xl-4 col-md-4">
      <div class="card h-100">
        <div class="card-header">${cardData.name.common}</div>
        <div class="card-body">
          <img
            class="card-img-top"
            src="${cardData.flags.png}"
            alt="Country flag"
          />
          <div class="card-text">
            Capital: ${capital}<br />Region: ${cardData.region}<br />Country
            Code: ${root}${suffixes}<br /><span
              data-lat="${cardData.latlng[0]}"
              data-lng="${cardData.latlng[1]}"
              >lat: ${cardData.latlng[0]} | lng: ${cardData.latlng[1]}</span
            >
          </div>
          <button id="weather-btn" class="btn btn-primary">
            Click for Weather
          </button>
        </div>
      </div>
    </div>
  `;
}

// EventListener for weather button
async function evenListenFun() {
  let weatherBtn = document.querySelectorAll("#weather-btn");
  weatherBtn.forEach((element) => {
    element.addEventListener("click", () => {
      const weatherBtn = element.parentElement.children[2];
      weatherBtn.disabled = true;
      const lat = element.parentElement.children[1].children[3].dataset.lat;
      const lng = element.parentElement.children[1].children[3].dataset.lng;
      getWeatherData(lat, lng).then((data) => {
        const displayWeather = document.createElement("div");
        displayWeather.classList.add("text-success");
        displayWeather.innerHTML = `Weather : ${data.weather[0].description} <img id="weatherIcon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon"></div>`;
        element.parentElement.children[1].appendChild(displayWeather);
        weatherBtn.remove();
      });
    });
  });
}

// Fetching data from OpenWeather
async function getWeatherData(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`
  );
  const data = await res.json();
  return data;
}
getData();