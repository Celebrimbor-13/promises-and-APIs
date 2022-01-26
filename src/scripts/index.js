import "../css/index.css";
import { threeMovies } from "./threeInputs";
threeMovies();

// fetch movies
function data(search) {
  return new Promise((resolve) => {
    fetch(`http://www.omdbapi.com/?t=${search}&apikey=84ebe415`).then((search) => {
      resolve(search.json());
    });
  });
}
// fetch data for country flags and currencies
function countryStaff(country) {
  return new Promise((resolve) => {
    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`).then(
      (countryData) => {
        resolve(countryData.json());
      }
    );
  });
}

let monthArr = [
  "jen",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
let movieButton = document.getElementById("movieBtn");
let resultDiv = document.getElementById("result");
let yearsAge = resultDiv.appendChild(document.createElement("p"));
let actorNames = resultDiv.appendChild(document.createElement("p"));
let currencyNflag = resultDiv.appendChild(document.createElement("div"));

movieButton.addEventListener("click", function () {
  // to clear from old map and currency elements
  if (currencyNflag.children.length) {
    while (currencyNflag.firstChild) {
      currencyNflag.removeChild(currencyNflag.firstChild);
    }
  }

  let receivedMovie = document.getElementById("movieName").value;
  let ourMovie = data(receivedMovie);

  // this part of code is responsible for retrieveing release year of movie and actor names
  ourMovie
    .then((movie) => {
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth();
      let released = movie["Released"];
      let actors = movie["Actors"];
      let actorsArr = actors.split(",");
      let actorsAsStr = "";
      let releasedToArr = released.split(" ");
      let country = movie["Country"];
      let countryArr = country.split(",");
      actorsArr.forEach((actor) => {
        let readyActors = actor.trim().split(" ")[0] + ", ";
        actorsAsStr += readyActors;
      });

      yearsAge.innerText =
        parseInt(currentYear) - parseInt(releasedToArr[2]) > 0
          ? `${receivedMovie} was relesed ${
              parseInt(currentYear) - parseInt(releasedToArr[2])
            } year(s) ago`
          : `${receivedMovie} was released ${
              parseInt(currentMonth) - monthArr.indexOf(releasedToArr[1])
            } month(s) ago`;

      actorNames.innerText = `Actors who played main roles: ${actorsAsStr.slice(0, -2)}`;
      return countryArr;
    })

    // ---------------------------------------------------------------------
    // this part of code is responsible fro flags and currencies
    .then((country) => {
      for (let c = 0; c < country.length; c++) {
        let currencyP = currencyNflag.appendChild(document.createElement("p"));
        let flagImg = currencyNflag.appendChild(document.createElement("img"));
        countryStaff(country[c].trim())
          .then((readyCdata) => {
            currencyP.innerText = ` Currency  for ${country[c].trim()} is ${Object.keys(
              readyCdata[0].currencies
            )}. `;
            flagImg.src = readyCdata[0].flags.png;
          })
          // does not recognize old movies, for example soviet movies
          .catch(() => {
            currencyP.innerText = "Could not find country";
          });
      }
    })
    // alert if no movie found in database
    .catch(() => {
      yearsAge.innerText = "Please enter valid data!";
    });
});

export { data, countryStaff };
