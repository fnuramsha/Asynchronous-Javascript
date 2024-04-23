"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// ///////////////////////////////////////

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

const renderData = function (data, className = "") {
  const currency = Object.values(data.currencies)[0].name;
  const languages = Object.values(data.languages);
  console.log(currency, languages);
  // Now add cards
  const html = `<article class="country" ${className}>
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      data.population / 1000000
    ).toFixed(1)} people</p>
    <p class="country__row"><span>🗣️</span>${Object.values(data.languages).join(
      ", "
    )}</p>
    <p class="country__row"><span>💰</span>${currency}</p>

  </div>
  </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};
// const getCountryAndNeigbhourData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
//   //   // request.open("GET", "https://restcountries.eu/rest/v2/name/portugal");
//   request.send();

//   request.addEventListener("load", function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     renderData(data);
//     // Get second country
//     const [neighbor] = data.borders;
//     console.log(neighbor);
//     if (!neighbor) return;
//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `https://restcountries.com/v3.1/alpha/${neighbor}`);
//     // request.open("GET", "https://restcountries.eu/rest/v2/name/portugal");
//     request2.send();

//     request2.addEventListener("load", function () {
//       console.log(this.responseText);
//       const [data2] = JSON.parse(this.responseText);
//       console.log(data2);
//       renderData(data2, "neighbor");
//     });
//   });
// };

// getCountryAndNeigbhourData("germany");
// getCountryAndNeigbhourData("germany");
// getCountryAndNeigbhourData("pakistan");
// getCountryAndNeigbhourData("usa");

// const request = fetch("https://restcountries.com/v3.1/name/portugal");
// console.log(request);

const getJSON = function (url, errorMsg) {
  return fetch(url).then((response) => {
    console.log(response);
    if (!response.ok) {
      throw new Error(`${errorMsg} ${response.status}`);
    }
    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, "Country not found")
    .then((data) => {
      renderData(data[0]);

      const neighbor = data[0].borders[0];

      if (!neighbor) throw new Error("No neighbor found");
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        "Country not found"
      );
    })

    .then((data) => renderData(data[0], "neighbor"))
    .catch((err) => {
      console.error(`${err}`);
      renderError(`Something went wrong. ${err.message} Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  getCountryData("usa");
});
getCountryData("australia");
