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
let getSmallImgMovie = (youtubeId) => `http://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
let getBigImgMovie = (youtubeId) => `http://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`


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
let elMoviesBookmarkButton = $_(".header__bookmark");
let elMoviesBookmarkCount = $_(".header__bookmark-count");
let elMovieTemplate = $_(".movie-template").content;

// Modal elements
let elModalMovie = $_(".modal")
let elModalMovieVideo = $_(".modal__inner-video")
let elModalMovietitle = $_(".js-modal-info__title")
let elModalStars = $_(".js-movie__rating-star-modal")
let elModalStarsRating = $_(".js-movie__rating-count-modal")
let elModalMovieLanguage = $_(".js-modal-info__language")
let elModalMovieCategoryList = $_(".js-modal-info__categories-list")
let elModalMovieYear = $_(".js-modal-info__year")
let elModalMovieSummary = $_(".js-modal-info__summary")

const bookmarkVideosLocalStorage = JSON.parse(localStorage.getItem("bookmarkMovies"));

let searchedMovies = [];
let bookmarkVideos = bookmarkVideosLocalStorage || [];


let updateBookmarkCaunt = () => {
  elMoviesBookmarkCount.textContent = bookmarkVideos.length;
};

updateBookmarkCaunt()

let addBookmarkVideo = (video) => {
  bookmarkVideos.push(video)
  localStorage.setItem("bookmarkMovies", JSON.stringify(bookmarkVideos));
  updateBookmarkCaunt()
}
let removeBookmarkVideo = (index) => {
  bookmarkVideos.splice(index, 1)
  localStorage.setItem("bookmarkMovies", JSON.stringify(bookmarkVideos));
  updateBookmarkCaunt()
}

let countOfResult = (elCount, renderingArray) => {
  elCount.textContent = renderingArray.length === 0 ? "Topilmadi 🙁" : `${renderingArray.length} ta`
}

let renderCategoryOptions = (optionsArr) => {
  let optionFragment = document.createDocumentFragment();
  optionsArr.forEach((category) => {
    let newOption = createElement("option", "search__form-select-option", category);
    newOption.value = category;
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
  return movies.filter((movie) => {
    let matchCategory = category === "all" || movie.categories.includes(category)
    let matchYear = year ? movie.movieYear === Number(year) : true;
    return movie.title.toString().match(textReg) && matchYear && matchCategory; -847
  });
};

// madal ochadi
let openModalMovie = (searchingArray, movieCliked) => {
  let searchedMovie = searchingArray.find((movie) => movie.imdbId === movieCliked.dataset.videoId);
  if (searchedMovie) {
    elModalMovieCategoryList.innerHTML = ""
    elModalMovieVideo.src = `https://www.youtube.com/embed/${searchedMovie.youtubeId}`
    elModalMovietitle.textContent = searchedMovie.fullTitle;
    elModalStars.style.width = `${searchedMovie.imdbRating * 10}%`;
    elModalStarsRating.textContent = searchedMovie.imdbRating;
    elModalMovieLanguage.textContent = searchedMovie.language;
    let modalMovieCategoryFragment = document.createDocumentFragment()
    searchedMovie.categories.forEach((category) => {
      let categoryItem = createElement("li", "modal-info__categories-item", category)
      modalMovieCategoryFragment.appendChild(categoryItem)
    })
    elModalMovieCategoryList.appendChild(modalMovieCategoryFragment)
    elModalMovieYear.textContent = searchedMovie.movieYear;
    elModalMovieSummary.textContent = searchedMovie.summary || "No sammery has written";
    elModalMovie.classList.add("modal--open")
  }
}

const topMovie = 7.6;

let renderMovies = (moviesArray, elList) => {
  elList.innerHTML = "";
  let elMovieListFragment = document.createDocumentFragment();
  moviesArray.forEach((movie, index) => {
    let elMovieTemplateClone = elMovieTemplate.cloneNode(true);
    let movieLink = $_(".movie__link", elMovieTemplateClone)
    bookmarkVideos.forEach((bookmarkVideo) => {
      if (bookmarkVideo.imdbId === movie.imdbId) {
        $_(".movie__details-bookmark", elMovieTemplateClone).classList.add(
          "movie__details-bookmark--clicked"
        );
      }
    });
    $_(".movie__details-bookmark", elMovieTemplateClone).dataset.videoId = movie.imdbId;
    movieLink.dataset.videoId = movie.imdbId;
    movieLink.href = `/${movie.imdbId}`;
    $_(".movie__img", elMovieTemplateClone).src = movie.smallImageUrl;
    $_(".movie__status", elMovieTemplateClone).textContent = movie.imdbRating >= topMovie ? "Top film" : "oddiy";
    $_(".movie__rating-star", elMovieTemplateClone).style.width = `${movie.imdbRating * 10}%`;
    $_(".movie__rating-count", elMovieTemplateClone).textContent = movie.imdbRating;
    $_(".movie__date", elMovieTemplateClone).textContent = movie.movieYear;
    $_(".movie__language", elMovieTemplateClone).textContent = movie.language;
    $_(".movie__duration", elMovieTemplateClone).textContent = movie.runtime;
    $_(".movie__title", elMovieTemplateClone).textContent = movie.title;

    movieLink.addEventListener("click", (evt) => {
      evt.preventDefault()
      console.log(evt.target);
      openModalMovie(searchedMovies, movieLink);
    })
    elMovieListFragment.appendChild(elMovieTemplateClone);
  });
  elList.appendChild(elMovieListFragment);
};
let toggleMarkVideo = (loopArray, bookmarkButton) => {
  loopArray.forEach((movie) => {
    if (movie.imdbId === bookmarkButton.dataset.videoId) {
      let searchedMovieIndex = bookmarkVideos.findIndex((bookmarkVideo) => {
        return bookmarkVideo.imdbId === movie.imdbId;
      });
      if (searchedMovieIndex === -1) {
        addBookmarkVideo(movie)
        bookmarkButton.classList.add("movie__details-bookmark--clicked");
      } else {
        removeBookmarkVideo(searchedMovieIndex)
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
  countOfResult(elMoviesCountSearch, searchedMovies)
  renderMovies(searchedMovies, elMoviesSearchList);
});

// bosilganni oldigan
elModalMovie.addEventListener("click", (evt) => {
  if (evt.currentTarget === evt.target) {
    elModalMovie.classList.remove("modal--open");
  }
})

elMoviesSearchList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movie__details-bookmark")) {
    countOfResult(elMoviesCountSearch, searchedMovies)
    toggleMarkVideo(searchedMovies, evt.target);
  }
});
//bookmark button nav

elMoviesBookmarkButton.addEventListener("click", (evy) => {
  elMoviesSearch.classList.add("visually-hidden")
  elMoviesBookmarks.classList.remove("visually-hidden")
  countOfResult(elMoviesBookmarksCount, bookmarkVideos)
  renderMovies(bookmarkVideos, elMoviesBookmarksList);
})

// mark button movie

elMoviesBookmarksList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movie__details-bookmark")) {
    toggleMarkVideo(bookmarkVideos, evt.target);
    countOfResult(elMoviesBookmarksCount, bookmarkVideos)
    renderMovies(bookmarkVideos, elMoviesBookmarksList);
  }
});
