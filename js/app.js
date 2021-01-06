let $_ = function (selector, node = document) {
  return node.querySelector(selector);
};

let $$_ = function (selector, node = document) {
  return node.querySelectorAll(selector);
};

let createElement = function (element, elementClass, text) {
  let newElement = document.createElement(element);
  if (elementClass) {
    newElement.setAttribute("class", elementClass);
  }
  if (text) {
    newElement.textContent = text;
  }
  return newElement;
};

// set megin top on tablet and mobile mode
document.body.style.marginTop =
  document.querySelector(".header").offsetHeight + "px";

let elSearchForm = $_(".js-search__form");
let elSearchInput = $_(".js-search__form-input");
let elCategorySelect = $_(".js-search__form-select");
let elYearInput = $_(".js-search__form-year-input");
let elMoviesSearch = $_(".js-movies-search");
let elMoviesBookmarks = $_(".js-movies-bookmarks");
let elMoviesSearchList = $_(".js-movies__list-search");
let elMoviesBookmarksList = $_(".js-movies__list-bookmarks");
let elMoviesTitle = $_(".movies__title");
let elMoviesCountSearch = $_(".js-movies__count-search");
let elMoviesBookmarksCount = $_(".js-movies__count-bookmarks");
let elMoviesSearchLoading = $_(".loading");
let elMoviesBookmarksLoading = $_(".loading-bookmarks");
let elMoviesBookmarkButton = $_(".header__bookmark");
let elMovieTemplate = $_(".movie-template").content;

let searchedMovies = [];
let bookmarkVideos = [];

let renderCategoryOptions = (arr) => {
  let optionFragment = document.createDocumentFragment();
  arr.forEach((cat) => {
    let newOption = createElement("option", "search__form-select-option", cat);
    newOption.value = cat;
    optionFragment.appendChild(newOption);
  });
  elCategorySelect.appendChild(optionFragment);
};

let optionsArray = [];
movies.forEach((movie) => {
  movie.categories.forEach((category) => {
    if (!optionsArray.includes(category)) {
      optionsArray.push(category);
    }
  });
});
renderCategoryOptions(optionsArray);

let searchMovie = (text, category, year) => {
  let textReg = new RegExp(text, "i");
  let newArray = movies.filter((movie) => {
    if (text) {
      return movie.fullTitle.match(textReg);
    } else if (year) {
      return movie.movieYear === Number(year);
    } else if (category) {
      movie.categories.forEach((categoryMov) => {
        return categoryMov == category;
      });
    }
  });
  return newArray;
};
const topMovie = 7.6;
let renderMovies = (arr, count, loading, list) => {
  loading.textContent = "loading...";
  list.innerHTML = "";
  count.textContent = "...";
  setTimeout(() => {
    loading.textContent = "";
    count.textContent =
      arr.length === 0 ? "Topilmadi :(" : `${arr.length} ta`;
    let elMovieListFragment = document.createDocumentFragment();

    arr.forEach((movie, index) => {
      let elMovieTemplateClone = elMovieTemplate.cloneNode(true);
      bookmarkVideos.forEach((bookmarkVideo) => {
        if (bookmarkVideo.imdbId === movie.imdbId) {
          $_(".movie__details-bookmark", elMovieTemplateClone).classList.add(
            "movie__details-bookmark--clicked"
          );
        }
      });
      $_(".movie__details-bookmark", elMovieTemplateClone).dataset.videoId =
        movie.imdbId;
      $_(".movie__img", elMovieTemplateClone).src = `https://picsum.photos/200/320?random=${index}`;
      $_(".movie__status", elMovieTemplateClone).textContent = movie.imdbRating >= topMovie ? "Top film" : "oddiy";
      $_(".movie__rating-star", elMovieTemplateClone).style.width = `${movie.imdbRating * 10}%`;
      $_(".movie__rating-count", elMovieTemplateClone).textContent = movie.imdbRating;
      $_(".movie__date", elMovieTemplateClone).textContent = movie.movieYear;
      $_(".movie__language", elMovieTemplateClone).textContent = movie.language;
      $_(".movie__duration", elMovieTemplateClone).textContent = movie.runtime;
      $_(".movie__title", elMovieTemplateClone).textContent = movie.title;
      elMovieListFragment.appendChild(elMovieTemplateClone);
    });
    elMoviesSearchList.appendChild(elMovieListFragment);
  }, 800);
};
let bookmarkVideo = (searchArray, bookmarkButton) => {
  searchArray.forEach((movie) => {
    if (movie.imdbId === bookmarkButton.dataset.videoId) {
      let isExsist = bookmarkVideos.findIndex((bookmarkVideo) => {
        return bookmarkVideo.imdbId === movie.imdbId;
      });
      console.log(isExsist);
      if (isExsist === -1) {
        bookmarkVideos.push(movie);
        bookmarkButton.classList.add("movie__details-bookmark--clicked");
      } else {
        bookmarkVideos.splice(isExsist, 1);
        bookmarkButton.classList.remove("movie__details-bookmark--clicked");
      }
    }
  });
};

elSearchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  searchedMovies = searchMovie(
    elSearchInput.value,
    elCategorySelect.value,
    elYearInput.value
  );
  elMoviesSearch.classList.remove("visually-hidden")
  elMoviesBookmarks.classList.add("visually-hidden")
  renderMovies(searchedMovies, elMoviesCountSearch, elMoviesSearchLoading, elMoviesSearchList);
});

// elMoviesSearchList.addEventListener("click", (evt) => { });

elMoviesSearchList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movie__details-bookmark")) {
    bookmarkVideo(searchedMovies, evt.target);
  }
});
elMoviesBookmarkButton.addEventListener("click", (evy) => {
  elMoviesSearch.classList.add("visually-hidden")
  elMoviesBookmarks.classList.remove("visually-hidden")
  renderMovies(bookmarkVideos, elMoviesBookmarksCount, elMoviesBookmarksLoading, elMoviesBookmarksList);
})
// elMoviesBookmarksList.addEventListener("click", (evt) => {
//   if (evt.target.matches(".movie__details-bookmark")) {
//     bookmarkVideo(searchedMovies, evt.target);
//   }
// });
