document.body.style.marginTop =
  document.querySelector(".header").offsetHeight + "px";

let elLoadingBox = $_(".wrapper-loading")
window.addEventListener("load", (evt) => {
  elLoadingBox.classList.add("wrapper-loading--close")
})
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

// search details
let elSearchDetailsList = $_(".js-movies__details-list");
let elSearchDetailsButtons = $$_(".js-movies__details-button")
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

// top movies

let elTopMoviesList = $_(".js-movies__list-top")
let elTopMoviesSection = $_(".js-movies-top")

// pagination item template
let elPaginationItemTemplate = $_(".pagination-item-template").content;
let elPaginationSearchList = $_(".js-pagination-search");
let elPaginationBookmarkList = $_(".js-pagination-bookmark");
const bookmarkVideosLocalStorage = JSON.parse(localStorage.getItem("bookmarkMovies"));

let searchedMovies = [];
let bookmarkVideos = bookmarkVideosLocalStorage || [];
var countOfPerPage = 10;

var currentPageSearch = 1;
var currentPageBookmark = 1;

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

const topMovie = 8;
let createCardMovie = (movie, arrDisplay = searchedMovies) => {
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
  $_(".movie__img", elMovieTemplateClone).src = movie.smallImageUrl;
  $_(".movie__status", elMovieTemplateClone).textContent = movie.imdbRating >= topMovie ? "Top film" : "oddiy";
  $_(".movie__rating-star", elMovieTemplateClone).style.width = `${movie.imdbRating * 10}%`;
  $_(".movie__rating-count", elMovieTemplateClone).textContent = movie.imdbRating;
  $_(".movie__date", elMovieTemplateClone).textContent = movie.movieYear;
  $_(".movie__language", elMovieTemplateClone).textContent = movie.language;
  $_(".movie__duration", elMovieTemplateClone).textContent = movie.runtime;
  $_(".movie__title", elMovieTemplateClone).textContent = movie.title;
  movieLink.dataset.videoId = movie.imdbId;
  movieLink.href = `/${movie.imdbId}`;

  movieLink.addEventListener("click", (evt) => {
    evt.preventDefault()
    openModalMovie(arrDisplay, movieLink);
  });

  return elMovieTemplateClone;
};
let toggleBookmarkMovie = (loopArray, bookmarkButton) => {
  loopArray.forEach((movie) => {
    if (movie.imdbId === bookmarkButton.dataset.videoId) {
      let searchedMovieIndex = bookmarkVideos.findIndex(bookmarkVideo => bookmarkVideo.imdbId === movie.imdbId);
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
let resetAll = () => {
  elSearchInput.value = "";
  elCategorySelect.value = "all"
  elYearInput = ""
  currentPageSearch = 1
  elSearchDetailsButtons.forEach((childElement) => {
    console.log(childElement);
    childElement.classList.remove("movies__details-button--active")
  })
}

let paginatedMovies = (arrayMovies, pageCurrent) => arrayMovies.slice((pageCurrent - 1) * countOfPerPage, (pageCurrent - 1) * countOfPerPage + countOfPerPage)

let paginatedPages = (moviesArr) => Math.ceil(moviesArr.length / countOfPerPage);

let displayPaginatedItems = (arrMovies, pageCurrent, elList = elPaginationSearchList) => {
  let elPaginationListFragment = document.createDocumentFragment()
  elList.innerHTML = ""
  for (let i = 1; i <= paginatedPages(arrMovies); i++) {
    let elPaginationClone = elPaginationItemTemplate.cloneNode(true);
    console.log(i, Number(pageCurrent));
    if (i === Number(pageCurrent)) {
      $_(".page-link", elPaginationClone).classList.add("page-link--active");
    }

    $_(".page-link", elPaginationClone).textContent = i;
    $_(".page-link", elPaginationClone).dataset.page = i;
    elPaginationListFragment.appendChild(elPaginationClone)
  };
  elList.appendChild(elPaginationListFragment);
}

let displayMovies = (moviesArray, displayList) => {
  displayList.innerHTML = "";
  let elMovieListFragment = document.createDocumentFragment();
  moviesArray.forEach((movie) => {
    elMovieListFragment.appendChild(createCardMovie(movie, moviesArray))
  })
  displayList.appendChild(elMovieListFragment)
}

const topMovies = movies.slice().sort((a, b) => b.imdbRating - a.imdbRating);
displayMovies(topMovies.slice(0, 20), elTopMoviesList)

// Events
elSearchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  searchedMovies = searchMovie(
    elSearchInput.value,
    elCategorySelect.value,
    elYearInput.value
  );
  elMoviesSearch.classList.remove("section--close")
  // elMoviesBookmarks.classList.add("section--close")
  resetAll()
  displayMovies(paginatedMovies(searchedMovies, currentPageSearch), elMoviesSearchList);
  displayPaginatedItems(searchedMovies, currentPageSearch)
  countOfResult(elMoviesCountSearch, searchedMovies)
});

elTopMoviesList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movie__details-bookmark")) {
    toggleBookmarkMovie(topMovies, evt.target);
  }
})


//bookmark button nav bosilgandagi funcksuya
elMoviesBookmarkButton.addEventListener("click", (evy) => {
  elMoviesSearch.classList.add("section--close")
  elMoviesBookmarks.classList.remove("section--close")
  elTopMoviesSection.classList.add("section--close")
  currentPageBookmark = 1
  displayMovies(paginatedMovies(bookmarkVideos, currentPageBookmark), elMoviesBookmarksList);
  displayPaginatedItems(bookmarkVideos, currentPageBookmark, elPaginationBookmarkList)
  countOfResult(elMoviesBookmarksCount, bookmarkVideos)
})

elPaginationSearchList.addEventListener("click", evt => {
  if (evt.target.matches(".page-link")) {
    evt.preventDefault()
    currentPageSearch = evt.target.dataset.page;
    displayMovies(paginatedMovies(searchedMovies, currentPageSearch), elMoviesSearchList);
    displayPaginatedItems(searchedMovies, currentPageSearch)
  }
})

elPaginationBookmarkList.addEventListener("click", evt => {
  if (evt.target.matches(".page-link")) {
    evt.preventDefault()
    currentPageBookmark = evt.target.dataset.page;
    displayMovies(paginatedMovies(bookmarkVideos, currentPageBookmark), elMoviesBookmarksList);
    displayPaginatedItems(bookmarkVideos, currentPageBookmark, elPaginationBookmarkList)
  }
})

// Modal bosilganda quloq soluvchi funksiya
elModalMovie.addEventListener("click", (evt) => {
  if (evt.currentTarget === evt.target) {
    elModalMovie.classList.remove("modal--open");
  }
})

// Poisk qilganda chiqadigan ul ichidagi bookmark button bosilgandagi funcksuya,
elMoviesSearchList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movie__details-bookmark")) {
    countOfResult(elMoviesCountSearch, searchedMovies)
    toggleBookmarkMovie(searchedMovies, evt.target);
  }
});

// Bookmark pageidagi ul ichidagi bookmark button bosilgandagi funcksuya,
elMoviesBookmarksList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movie__details-bookmark")) {
    toggleBookmarkMovie(bookmarkVideos, evt.target);
    displayMovies(bookmarkVideos, elMoviesBookmarksList);
    countOfResult(elMoviesBookmarksCount, bookmarkVideos);
  }
});

// Sort By name A-Z and Z-A
elSearchDetailsList.addEventListener("click", (evt) => {
  if (evt.target.matches(".movies__details-button")) {
    if (evt.target.dataset.sort === "rating_desc") {
      searchedMovies.sort((a, b) => b.imdbRating - a.imdbRating) // Rating Top to bottom
    } if (evt.target.dataset.sort === "rating_asc") {
      searchedMovies.sort((a, b) => a.imdbRating - b.imdbRating) // Rating bottom to Top
    }
    if (evt.target.dataset.sort === "az") {
      searchedMovies.sort((a, b) => {
        if (a.title > b.title) return 1;
        else if (a.title < b.title) return -1;
        return 0;
      });
    }
    if (evt.target.dataset.sort === "za") {
      searchedMovies.sort((a, b) => {
        if (a.title > b.title) return -1;
        else if (a.title < b.title) return 1;
        return 0;
      });
    }
    elSearchDetailsButtons.forEach((childElement) => {
      console.log(childElement);
      childElement.classList.remove("movies__details-button--active")
    })
    evt.target.classList.add("movies__details-button--active")
    displayMovies(paginatedMovies(searchedMovies, currentPageSearch), elMoviesSearchList);
    displayPaginatedItems(searchedMovies, currentPageSearch)
  }
})