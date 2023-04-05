const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResuts: 0,
  },
  // replace your api key
  api: {
    API_URL: `https://api.themoviedb.org/3/`,
    apiKey: async () => {
      const res = await fetch("./api_key.json");
      const data = await res.json();
      return data[0].api_key;
    },
  },
};
// console.log(window.location.pathname);

// console.log(global.currentPage);

// highlight active link
function highlightActiveLink() {
  const link = document.querySelectorAll(".nav-link");
  link.forEach((link) => {
    if (`/011_%20flixx_movie_app/` + link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData(`movie/popular`);

  const card = document.querySelector("#popular-movies");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.original_title}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.original_title}" />
        </a>`
        }
        </a>
        <div class="card-body">
        <h5 class="card-title">${movie.original_title}</h5>
      <p class="card-text">
      <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
      </div>
      `;
    card.appendChild(div);
  });
}

// display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData(`tv/popular`);
  // console.log(results);

  const card = document.querySelector("#popular-shows");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href=" tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" class="card-img-top" alt="${show.name}" />`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />
          </a>`
          }
          </a>
          <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
        </div>`;

    card.appendChild(div);
  });
}

async function displayMovieDitails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);
  // console.log(movie);
  // console.log(movie.genres);

  // overlay for background image

  displayBackgroundImage("movie", movie.backdrop_path);
  displayCast("movie", movieId);
  const div = document.createElement("div");

  const numberFormatter = Intl.NumberFormat("en", { maximumSignificantDigits: 3 });

  // const movieDetail = document.querySelector("#movie-details");

  div.innerHTML = `
        <div class="details-top">
          <div>
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : `images/no-image.jpg`}" class="card-img-top" alt="${movie.title}" />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <h4 class="tagline">${movie.tagline}</h4>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${numberFormatter.format(movie.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${numberFormatter.format(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${numberFormatter.format(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `${company.name}(${company.origin_country})`).join(", ")}</div>
        </div>
        <h4>Countries Shot</h4>
        <div class="list-group">${movie.production_countries.map((countries) => `${countries.name}`).join(", ")}</div>
        </div>`;
  document.querySelector("#movie-details").appendChild(div);
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showId}`);
  // console.log(show);

  displayBackgroundImage("show", show.backdrop_path);
  displayCast("tv", showId);

  const div = document.createElement("div");

  div.innerHTML = `
        <div class="details-top">
          <div>
            <img src="${show.poster_path ? `https://image.tmdb.org/t/p/w500/${show.poster_path}` : `images/no-image.jpg`}" class="card-img-top" alt="Show Name" />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
            ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${show.homepage}" target="${show.homepage}" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_air_date}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((companie) => companie.name).join(", ")}</div>
        </div>`;

  document.querySelector("#show-details").appendChild(div);
}

async function displayCast(type, id) {
  const { cast } = await fetchAPIData(`${type}/${id}/credits`);
  console.log(cast);

  const div = document.createElement("div");
  div.setAttribute("id", "cast");
  document.querySelector(`#${type === "movie" ? "movie" : "show"}-details`).appendChild(div);

  cast.forEach((a) => {
    const actor = document.createElement("div");
    actor.setAttribute("class", "cast");
    actor.innerHTML = `
    <div class="actor">
      <div class="circle-pic">
        <a href="person-details.html?id=${a.id}">
          <img src="https://image.tmdb.org/t/p/w200${a.profile_path}" alt="${a.name}">
        </a>
      </div>
      <div>
        <p class="actor-name">${a.name}</p>
        <p class="character-name">${a.character}</p>
      </div>
    </div>
    `;
    div.appendChild(actor);
    // console.log(`https://image.tmdb.org/t/p/original/${a.profile_path}`);
  });
}

async function displayPersonDetails() {
  const personId = window.location.search.split("=")[1];

  const personDetails = await fetchAPIData(`person/${personId}`);
  // const personDetails = await fetchAPIData(`person/${personId}/movie_credits`);

  const age = calcAge(personDetails.birthday, personDetails.deathday);
  console.log(age);

  const div = document.createElement("div");

  div.innerHTML = `
        <div class="details-top">
          <div>
            <img src="https://image.tmdb.org/t/p/w300${personDetails.profile_path}" class="card-img-top" alt="Show Name" />
          </div>
          <div>
            <h2>${personDetails.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              8 / 10
            </p>
            <p class="text-muted">Born in: ${personDetails.birthday} (${age})</p>
            <p>
              ${personDetails.biography}
            </p>
            <!--<h5>Genres</h5>
            <ul class="list-group">
              <li>Genre 1</li>
              <li>Genre 2</li>
              <li>Genre 3</li>
            </ul>-->
            ${personDetails.homepage !== null ? `<a href="${personDetails.homepage}" target="${personDetails.homepage}" class="btn">Visit Show Homepage</a>` : ""}
          </div>
        </div>
        <div class="details-bottom">
          
        </div>`;

  document.querySelector("#person-details").appendChild(div);
}

function calcAge(born, death) {
  if (death === null) {
    const birthDate = new Date(born);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      years--;
    }

    return years;
  }
  const birthDate = new Date(born);
  const today = new Date(death);
  let years = today.getFullYear() - birthDate.getFullYear();

  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    years--;
  }

  return years;
  return;
}

function showSpinner() {
  document.querySelector(".spinner").classList.toggle("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.toggle("show");
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  // console.log(`https://image.tmdb.org/t/p/original/${backgroundPath}`);
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

async function displayMoviesSlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((res) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="movie-details.html?id=${res.id}">
              <img src="${res.poster_path ? `https://image.tmdb.org/t/p/w500/${res.poster_path}` : `images/no-image.jpg`}" alt="${res.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${res.vote_average} / 10
            </h4>`;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResuts = total_results;

    if (results.length === 0) {
      showAlert("No matches found. Sorry");
      return;
    } else {
      displaySearchResults(results);

      document.querySelector("#search-term").value = "";
    }
  } else {
    showAlert("Please enter a search term");
  }
}

function displaySearchResults(results) {
  // clear previous results
  document.querySelector("#search-results").innerHTML = ``;
  document.querySelector("#search-results-heading").innerHTML = ``;
  document.querySelector("#pagination").innerHTML = ``;

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
    <img src="${result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : `images/no-image.jpg`}" class="card-img-top" alt="" />
    </a>
    <div class="card-body">
    <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}</h5>
    <p class="card-text">
    <small class="text-muted">Release: ${global.search.type === "movie" ? result.release_date : result.first_air_date}</small>
    </p>
    </div>`;

    document.querySelector("#search-results-heading").innerHTML = `
    <h2>${results.length} of ${global.search.totalResuts} for ${global.search.term}</h2>`;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");

  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector("#pagination").appendChild(div);

  // disable the prev and next button
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  } else if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  } else {
    document.querySelector("#prev").disabled = false;
    document.querySelector("#next").disabled = false;
  }

  // next page
  document.querySelector("#next").addEventListener("click", async (target) => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // preveus page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// show alert
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

async function displayShowsSlider() {
  const { results } = await fetchAPIData("tv/on_the_air");

  results.forEach((res) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="tv-details.html?id=${res.id}">
              <img src="${res.poster_path ? `https://image.tmdb.org/t/p/w500/${res.poster_path}` : `images/no-image.jpg`}" alt="${res.name}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${res.vote_average} / 10
            </h4>`;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function fetchAPIData(endpoint) {
  // Register your key at https://www.themoviedb.org/gettings/api and enter here
  // const API_URL = `https://api.themoviedb.org/3/`;
  // const apiKey = `b749cdb98a7421da95fb288b3ba68218`;

  showSpinner();

  const res = await fetch(`${global.api.API_URL}${endpoint}?api_key=${await global.api.apiKey()}&language=en-US`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //   api_key: apiKey,
    },
  });
  const data = await res.json();

  hideSpinner();

  return data;
}

async function searchAPIData() {
  // Register your key at https://www.themoviedb.org/gettings/api and enter here
  const API_URL = global.api.API_URL;
  const apiKey = await global.api.apiKey();

  showSpinner();

  const res = await fetch(`${API_URL}search/${global.search.type}?api_key=${apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //   api_key: apiKey,
    },
  });
  const data = await res.json();

  hideSpinner();

  return data;
}

// init app
function init() {
  // const start = "/011_%20flixx_movie_app";
  const start = "/modern_js_form_the_beginning_2.0/011_%20flixx_movie_app";
  switch (global.currentPage) {
    case `${start}/`:
    case `${start}/index.html`:
      console.log("Home");
      displayMoviesSlider();
      displayPopularMovies();
      break;
    case `${start}/shows.html`:
      console.log("Shows");
      displayShowsSlider();
      displayPopularShows();
      break;
    case `${start}/movie-details.html`:
      console.log("Movie Details");
      displayMovieDitails();
      break;
    case `${start}/tv-details.html`:
      console.log("TV Details");
      displayShowDetails();
      break;
    case `${start}/search.html`:
      console.log("Search");
      search();
      break;
    case `${start}/person-details.html`:
      console.log("Person");
      displayPersonDetails();
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
