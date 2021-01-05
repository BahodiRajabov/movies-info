let $_ = function (selector, node = document) {
  return node.querySelector(selector);
};

let $$_ = function (selector, node = document) {
  return node.querySelectorAll(selector);
};

// set megin top on tablet and mobile mode
document.body.style.marginTop =
  document.querySelector(".header").offsetHeight + "px";

// const newKinolar = movies.map((kino) => {
//   return {
//     title: kino.Title,
//     fullTitle: kino.fulltitle,
//     movieYear: kino.movie_year,
//     ategories: kino.Categories,
//     summary: kino.summary,
//     imageURL: kino.ImageURL,
//     imdbId: kino.imdb_id,
//     imdbRating: kino.imdb_rating,
//     runtime: kino.runtime,
//     language: kino.language,
//     youtubeId: kino.ytid,
//   };
// });
// console.log(newKinolar);
/*{
  "Title": "And Then I Go",
  "fulltitle": "And Then I Go (2017)",
  "movie_year": 2017,
  "Categories": "Drama",
  "summary": "In the cruel world of junior high, Edwin suffers in a state of anxiety and alienation alongside his only friend, Flake. Misunderstood by their families and demoralized at school daily, their fury simmers quietly until an idea for vengeance offers them a terrifying release. Based on the acclaimed novel \"Project X\" by Jim Shepard, this unflinching look at adolescence explores how the powerful bonds of childhood friendship and search for belonging can become a matter of life or death.",
  "ImageURL": "https://hydramovies.com/wp-content/uploads/2018/04/And-Then-I-Go-Movie-Poster.jpg",
  "imdb_id": "tt2018111",
  "imdb_rating": 7.6,
  "runtime": 99,
  "language": "English",
  "ytid": "8CdIiD6-iF0"
},
*/
