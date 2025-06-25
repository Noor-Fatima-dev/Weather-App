const search = document.querySelector("button");
const input = document.querySelector("#input");
const weatherDiv = document.querySelector("#weather-div");

const apiKey = "6db1b6f1f8954c058e7203705252406";

async function getWeather(city) {             // You can't use await without marking the function as async.await pauses the function until the promise is done.
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    try {
        const response  = await fetch(url);       // Ask server for weather
        
        if (!response.ok)
            throw new Error(`Server returned ${response.status} ${response.statusText}`);    // if response is not ok

        const data = await response.json();       // Convert response to JS object

        if (data.error)                          // WeatherAPI wraps its own errors
            throw new Error(data.error.message);

        weatherDisplay(data);
    }
    catch (err) {
        /*One catch block handles EVERYTHING above */
        weatherDiv.innerHTML = `<p class="error">${err.message}</p>`;
    }
}

function weatherDisplay(data) {
    // extract what we need from "data"
    const {
        location: { name, country, localtime},
        current: {
            temp_c,
            temp_f,
            humidity,
            wind_kph,
            feelslike_c,
            condition: { text, icon },
            last_updated
        }
    } = data

    // builds an html card to show this information
    weatherDiv.innerHTML = `
        <div class="card">
            <h2>${name}, ${country}</h2>
            <p class="time">${localtime}</p>
            <div class="main-part">
                <img src="https:${icon}" alt="${text}">
                <div>
                    <p class="temp">${temp_c}°C / ${temp_f}°F</p>
                    <p>${text}</p>
                </div>    
            </div>

            <ul class="details">
                <li><strong>Feels like:</strong> ${feelslike_c}°C</li>
                <li><strong>Humidity:</strong> ${humidity}%</li>
                <li><strong>Wind:</strong> ${wind_kph} kph</li>
                <li><strong>Updated:</strong> ${last_updated}</li>
            </ul>
        </div>
    `;
}
    

function btnClicked() {
    let city = input.value.trim();     // trim() removes extra spaces from the start and end of a string.
    input.value = "";
    if(city === "")
        alert("Enter a city");
    else {
        weatherDiv.innerHTML = `<p id="load">Loading</p>`;
        getWeather(city);
    }
};

search.addEventListener("click" , btnClicked);
input.addEventListener("keydown" , (btn) => {
    if(btn.key === "Enter")
        btnClicked();
});