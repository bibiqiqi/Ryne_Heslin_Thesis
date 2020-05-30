const global = {
  currentChapter: 'intro',
  currentColor: 'green',
  colors: {
    intro: 'green',
    chapter1: 'blue',
    chapter2: 'purple',
    chapter3: 'maroon',
    chapter4: 'red',
    chapter5: 'orange',
    chapter6: 'yellow',
    chapter7: 'beige',
    chapter8: 'light-orange',
    chapter9: 'light-pink',
    chapter10: 'lavender',
    chapter11: 'light-blue',
    chapter12: 'light-green',
    chapter13: 'brown',
    bibliography: 'forest-green',
  },
  highContrast: false
};

//functions for adding and removing classes
function addClass(elements, myClass) {
  if (!elements) { return; }
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }
  else if (elements.tagName) { elements=[elements]; }
  for (var i=0; i<elements.length; i++) {
    if ( (' '+elements[i].className+' ').indexOf(' '+myClass+' ') < 0 ) {
      if(elements[i].localName === "svg") {
        const currentClasses = elements[i].getAttribute("class");
        elements[i].setAttribute("class", currentClasses + ' ' + myClass);
      } else {
        elements[i].className += ' ' + myClass;
      }
    }
  }
}

function removeClass(elements, myClass) {
  if (!elements) { return; }
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }
  else if (elements.tagName) { elements=[elements]; }
  var reg = new RegExp('(^| )'+myClass+'($| )','g');
  for (var i=0; i<elements.length; i++) {
    if(elements[i].localName === "svg") {
      const currentClasses = elements[i].getAttribute("class");
      const newClasses = currentClasses.replace(reg,' ');
      elements[i].setAttribute("class", newClasses);
    } else {
      elements[i].className = elements[i].className.replace(reg,' ');
    }
  }
}

//initially called via main to add all the event listeners
function addTocEvents() {
  //add all the events for the ToC
  const tocList = (document.getElementById("toc-list"));
  const tocChapters = tocList.querySelectorAll('li');
  // console.log('tocChapters is', tocChapters)
  for (var i = 0; i < tocChapters.length; i++) {
    tocChapters[i].addEventListener("click", function() {
      const newChapterId = this.getAttribute('id').slice(4);
      document.getElementById('main-text').scrollTop = 0;
      makeNewChapter(newChapterId);
    })
  }
}

function addTurnPageEvents() {
  //add all left turn button events
  const leftTurnButtons = document.querySelectorAll(`#main-text button.left-turn`);
  leftTurnButtons.forEach(e => {
    e.addEventListener("click", () => {handlePageTurn(e, 'left-turn')});
  })
  //add all right turn button events
  const rightTurnButtons = document.querySelectorAll(`#main-text button.right-turn`);
  rightTurnButtons.forEach(e => {
    e.addEventListener("click", () => {handlePageTurn(e, 'right-turn')});
  })
}

function addHcButtonEvent() {
  //add 1 event listener that does different things based on whether global says that it's currently off or on
  const button = document.querySelector('#tab-of-contents button');
  button.addEventListener("click", function() {
    if(global.highContrast) {
      handleHcButtonOff(this);
      handleTextToAesthetic();
      global.highContrast = false;
    } else {
      handleHcButtonOn(this);
      handleTextToBlack();
      global.highContrast = true;
    }
  })
}

//all the event handlers

function handlePageTurn(turnElement, pageTurnClass) {
  //console.log('current chapter is', global.currentChapter, 'and you called handlePageTurn for', pageTurnClass)
  const chapters = Object.keys(global.colors);
  //console.log('chapters is', chapters);
  const colors = Object.values(global.colors);
  let i = chapters.indexOf(global.currentChapter);
  //console.log('index of current chapter', global.currentChapter, 'is', i);
  const newChapterId = pageTurnClass === 'right-turn' ? chapters[++i] : chapters[--i];
  //console.log('new index is', i, 'and newChapter is', newChapterId);
  document.getElementById('main-text').scrollTop = 0;
  makeNewChapter(newChapterId);
}

function handleHcButtonOn(element) {
  //remove text color
  removeClass(element, `${global.currentColor}-text`);
  //add gray color text
  addClass(element, `gray-text`);
  //add new color background on button
  addClass(element, `${global.currentColor}-background`);
  //add background on h1
  addClass(document.querySelector(`#tab-of-contents button h1`), `${global.currentColor}-background`);
}

function handleHcButtonOff(element) {
  //add text color to button
  addClass(element, `${global.currentColor}-text`);
  //remove gray color text
  removeClass(element, `gray-text`);
  //remove current color background
  removeClass(element, `${global.currentColor}-background`);
  //remove color background on h1
  removeClass(document.querySelector('#tab-of-contents button h1'), `${global.currentColor}-background`);
}

function handleTextToBlack() {
  //remove #toc-list text color
  removeClass(document.getElementById('toc-list'), `${global.currentColor}-text` );
  //remove #main-text text color
  removeClass(document.getElementById(`main-${global.currentChapter}`), `${global.currentColor}-text` );
  //remove #toc-list text color
  removeClass(document.querySelector(`#citations .citations-${global.currentChapter}`), `${global.currentColor}-text` );
  //addClass(document.querySelector('*'), 'black-text');
}

function handleTextToAesthetic() {
  //remove #toc-list text color
  addClass(document.getElementById('toc-list'), `${global.currentColor}-text`);
  //remove #main-text text color
  addClass(document.getElementById(`main-${global.currentChapter}`), `${global.currentColor}-text` );
  //remove #toc-list text color
  addClass(document.querySelector(`#citations .citations-${global.currentChapter}`), `${global.currentColor}-text` );
  //addClass(document.querySelector('*'), 'black-text');
}


//functions for removing and adding styling classes to page
function removeOldColor() {
  return new Promise(function(resolve, reject) {
    //remove .toc-title border color
    removeClass(document.querySelector('#tab-of-contents .toc-title'), `${global.currentColor}-border` );
    //remove .toc-title background color
    removeClass(document.querySelector('#tab-of-contents .toc-title'), `${global.currentColor}-background` );
    //remove #toc-list border color
    removeClass(document.getElementById('toc-list'), `${global.currentColor}-border` );
    //remove #toc-list text color
    removeClass(document.getElementById('toc-list'), `${global.currentColor}-text` );
    //remove #main-text scroll color
    removeClass(document.getElementById('main-text'), `${global.currentColor}-scroll` );
    removeClass(document.querySelector('#tab-of-contents button'), `${global.currentColor}-text`);
    //remove HC button border color
    removeClass(document.querySelector('#tab-of-contents button'), `${global.currentColor}-border`);
    resolve('removeOldColor is done')
  })
}

function addNewColor(newChapterId) {
  return new Promise(function(resolve, reject) {
    const newColor = global.colors[newChapterId];
    //add new .toc-title border color
    addClass(document.querySelector('#tab-of-contents .toc-title'), `${newColor}-border` );
    //add new .toc-title background color
    addClass(document.querySelector('#tab-of-contents .toc-title'), `${newColor}-background`);
    //add new #toc-list border color
    addClass(document.getElementById('toc-list'), `${newColor}-border`);
    //add new #toc-list text color
    addClass(document.getElementById('toc-list'), `${newColor}-text`);
    //add new #main-text scroll color
    addClass(document.getElementById('main-text'), `${newColor}-scroll`);
    //add HC button text color
    addClass(document.querySelector('#tab-of-contents button'), `${newColor}-text`);
    //add HC button border color
    addClass(document.querySelector('#tab-of-contents button'), `${newColor}-border`);
    resolve('addNewColor is done')
  })
}

//removes current chapter and text, title, and image, and adds new one
function changeChapter(newChapterId) {
  return new Promise(function(resolve, reject) {
    //hide current chapter
    addClass(document.getElementById(`main-${global.currentChapter}`), 'hidden');
    //reveal new chapter
    removeClass(document.getElementById(`main-${newChapterId}`), 'hidden');
    resolve('changeNewColor is done')
  })
}

//removes current citations, and adds new one
function changeCitations(newChapterId) {
  return new Promise(function(resolve, reject) {
    //hide current citation page
    addClass(document.querySelector(`#citations .citations-${global.currentChapter}`), 'hidden');
    //reveal new citation page
    removeClass(document.querySelector(`#citations .citations-${newChapterId}`), 'hidden');
    resolve('changeCitations is done')
  })
}

//moves the Table of Contents cursor to the new chapter
function moveTocCursor(newChapterId) {
  return new Promise(function(resolve, reject) {
    //console.log('element to add hidden class in is',
    addClass(document.querySelector(`#toc-${global.currentChapter} .bi`), 'hidden' );
    removeClass(document.querySelector(`#toc-${newChapterId} .bi`), 'hidden' );
    resolve('moveTocCursor() is done')
  })
}

//called by handlePageTurn() and addTocEvents()
//calls all the styling functions to generate new chapter
function makeNewChapter(newChapterId){
  if(global.highContrast) {
    //turn the color scheme back to off
    // console.log('calling handleHcButtonOff')
    const hCbutton = document.querySelector('#tab-of-contents button');
    handleHcButtonOff(hCbutton);
    handleTextToAesthetic();
  }
  //make sure these all resolve before calling main
  return Promise.all(
    [
      removeOldColor(),
      addNewColor(newChapterId),
      moveTocCursor(newChapterId),
      changeChapter(newChapterId),
      changeCitations(newChapterId)
    ]
  ).then(resolves => {
    // console.log(resolves)
    return updateGlobal(newChapterId);
  }).then(resolve => {
    // console.log(resolve)
  })
}

function updateGlobal(newChapterId) {
  return new Promise(function(resolve, reject) {
    global.currentChapter = newChapterId;
    global.currentColor = global.colors[newChapterId];
    // console.log('you updated global to', global)
    resolve('updateGlobal is done')
  })
}

function main() {
  addTocEvents();
  addTurnPageEvents();
  addHcButtonEvent();
}

document.addEventListener('DOMContentLoaded', function() {
  main();
}, false);
