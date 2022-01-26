import { countryStaff, data } from ".";

function threeMovies() {
  let movieBtnTwo = document.getElementById("movieBtn2");
  let resultMinutes = document.getElementById("resultMinutes");
  let resultPopulus = document.getElementById("resultPopulus");

  movieBtnTwo.addEventListener("click", function () {
    let inpOne = document.getElementById("movie1").value;
    let inpTwo = document.getElementById("movie2").value;
    let inpThree = document.getElementById("movie3").value;

    let inputArr = [inpOne, inpTwo, inpThree];
    let movieMinutes = [];
    let allCountryArr = [];
    let allCountryPopul = [];

    //there is needed for loop to access all three input fields

    for (let inp = 0; inp < inputArr.length; inp++) {
      let datas = data(inputArr[inp]);
      datas
        .then((receivedData) => {
          return receivedData;
        })
        .then((receivedData) => {
          movieMinutes.push(receivedData["Runtime"]);
          let totalMinutes = movieMinutes.reduce((accum, movie) => {
            return accum + parseInt(movie);
          }, 0);
          resultMinutes.innerText = `All three movies total length is ${totalMinutes} minutes`;
          allCountryArr.push(receivedData["Country"].split(", "));
          for (let arr = 0; arr < allCountryArr[inp].length; arr++) {
            countryStaff(allCountryArr[inp][arr]).then((country) => {
              allCountryPopul.push(country[0].population);
              let totalPopulus = allCountryPopul.reduce((accum, populus) => {
                return accum + parseInt(populus);
              }, 0);
              resultPopulus.innerText = `All countries population where these movies were made is ${totalPopulus}`;
            });
          }
        })
        .catch(() => {
          resultMinutes.innerText = "Please enter valid data!";
        });
    }
  });
}

export { threeMovies };
