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
