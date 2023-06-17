const slides = document.querySelectorAll('.banner ul li');
const paginationDots = document.querySelectorAll('.paginationBanner .dot');
let currentSlide = 0;
let slideInterval;

$(document).ready(function() {
  getPopularAnimes();
  getLatestAnimes();
  showSlide(0);
  setLineWidth();
  setLineWidthGender();
  getAnimesByGender('action')
  slideInterval = setTimeout(showNextSlide, 1000);
});

async function getPopularAnimes() {
  const queryUrl = 'https://kitsu.io/api/edge/anime';

  const params = new URLSearchParams({
    'page[limit]': 8, // Defina o número desejado de animes por página
    'page[offset]': 0, // Defina o deslocamento inicial
    'sort': 'popularityRank'
  });

  const url = `${queryUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors[0].title || 'Failed to fetch anime data');
    }
    
    const animeList = data.data;      

      for (const anime of animeList) {
        const { id, attributes } = anime;
        const {  titles, posterImage, episodeLength , startDate} = attributes;
        const imageUrl = posterImage ? posterImage.original : 'N/A';

        card = setCardAnime(id, imageUrl, titles, episodeLength, startDate)

        const container = document.querySelector('.containerAnimes');
        container.appendChild(card);

      }
    } catch (error) {
      console.log(error);
    }
}


async function getLatestAnimes() {
  const queryUrl = 'https://kitsu.io/api/edge/anime';
  
    const params = new URLSearchParams({
      'page[limit]': 8, // Defina o número desejado de animes por página
      'page[offset]': 0, // Defina o deslocamento inicial
      'filter[year]': 2023,
      'sort': '-averageRating'

    });

    const url = `${queryUrl}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors[0].title || 'Failed to fetch anime data');
      }

      const animeList = data.data;

      for (const anime of animeList) {
        const { id, attributes } = anime;
        const { titles, posterImage, episodeLength, startDate } = attributes;
        const imageUrl = posterImage ? posterImage.original : 'N/A';

        card = setCardAnime(id, imageUrl, titles, episodeLength, startDate)

        const container = document.querySelector('.containerAnimesLastRealese');
        container.appendChild(card);
      }
    } catch (error) {
      console.log(error);
    }
}


async function getAnimesByGender(gender) {
  const queryUrl = 'https://kitsu.io/api/edge/anime';
  
    const params = new URLSearchParams({
      'page[limit]': 4, // Defina o número desejado de animes por página
      'page[offset]': 0, // Defina o deslocamento inicial
      'filter[genres]': gender,
      'sort': '-averageRating'
    });

    const url = `${queryUrl}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors[0].title || 'Failed to fetch anime data');
      }

      const animeList = data.data;

      const divElement = document.querySelector('.containerAnimesGender');
      if (divElement !== null) {
        while (divElement.firstChild) {
          divElement.firstChild.remove();
        }
      }
      let animeListIds = [];
      const container = document.querySelector('.containerAnimesGender');
      const cardsRigth = document.createElement('div');
      cardsRigth.classList.add('cardsRigth');     

      for (const anime of animeList) {
        
        const { id, attributes } = anime;
        const { titles, coverImage, episodeLength, startDate, status } = attributes;
        const imageUrl = coverImage ? coverImage.original : 'N/A';
        card = setCardGenderAnime(id, imageUrl, titles, episodeLength, startDate,status)

        cardsRigth.appendChild(card);
        
        animeListIds.push(card.id);
      }

      getAnimeById(animeListIds[0]);

      container.appendChild(cardsRigth);

    } catch (error) {
      console.log(error);
    }
}

function setCardAnime(id, imageUrl, titles, episodeLength, startDate){
    
  const card = document.createElement('div');
  card.classList.add('card');
  card.id = id;
  card.onclick =  function() {
    GoToNextPage(this);
    };

  const image = document.createElement('img');
  image.src = imageUrl;
  card.appendChild(image);

  const titleElement = document.createElement('h3');
  titleElement.textContent = titles.en_jp || titles.en_us;
  card.appendChild(titleElement);

  const episodesElementAndData = document.createElement('p');
  episodesElementAndData.textContent = `${episodeLength} episódios | ${startDate}`;
  card.appendChild(episodesElementAndData);
  
  return card;
}

function setCardGenderAnime(id, imageUrl, titles, episodeLength, startDate, status){
    
  const card = document.createElement('div');
  card.classList.add('cardGender');
  card.id = id;
  card.onclick =  function() {
    getAnimeById(card.id);
    };

  const image = document.createElement('img');
  image.src = imageUrl;
  card.appendChild(image);

  const divText = document.createElement('div');
  divText.classList.add('cardGendertext');

  const titleElement = document.createElement('h3');
  titleElement.textContent = titles.en_jp || titles.en_us;
  divText.appendChild(titleElement);

  const episodesElementAndData = document.createElement('p');
  episodesElementAndData.textContent = `${status}`;
  divText.appendChild(episodesElementAndData);

  card.appendChild(divText);
  
  return card;
}

function setCardDescriptionAnime(id, imageUrl, titles, description){

  const card = document.createElement('div');
  card.classList.add('cardDrescription');
  card.id = id;

  const image = document.createElement('img');
  image.src = imageUrl;
  card.appendChild(image);

  const divText = document.createElement('div');
  divText.classList.add('cardDrescriptionText');

  const titleElement = document.createElement('h3');
  titleElement.textContent = titles.en_jp || titles.en_us;
  divText.appendChild(titleElement);

  const descriptionAnime = document.createElement('p');
  descriptionAnime.textContent = description;
  divText.appendChild(descriptionAnime);

  card.appendChild(divText);
  
  return card;
}

async function getAnimeById(animeId){

  const url = `https://kitsu.io/api/edge/anime/${animeId}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors[0].title || 'Failed to fetch anime data');
    }

    const anime = data.data;

    let cardsLeft = document.querySelector('.cardsLeft');
    if(cardsLeft === null){
      cardsLeft = document.createElement('div');
      cardsLeft.classList.add('cardsLeft');
    }
    else{
      while (cardsLeft.firstChild) {
        cardsLeft.firstChild.remove();
      }
    }
      
    const container = document.querySelector('.containerAnimesGender');

    const { id, attributes } = anime;
    const { titles, coverImage, description } = attributes;
    const imageUrl = coverImage ? coverImage.original : 'N/A';

    card = setCardDescriptionAnime(id, imageUrl, titles, description)
    
    cardsLeft.appendChild(card);

    container.appendChild(cardsLeft);

  } catch (error) {
    console.log(error);
  }

}

function GoToNextPage(e){
  console.log(e.getAttribute("id"))
  /*let id = e.getAttribute("id")
  localStorage.setItem('IdAnime', id);
  console.log(id);
  window.location.href = './src/pages/descrioptionAnime.html';*/
}
function showSlide(slideNumber) {
  currentSlide = slideNumber != null ? slideNumber : (currentSlide + 1) % slides.length;

  slides.forEach((slide, index) => {
    if (index === currentSlide) {
      slide.style.animation = 'slide-in 10s linear';
      slide.style.display = 'block';
    } else {
      slide.style.animation = '';
      slide.style.display = 'none';
    }
  });

  clearTimeout(slideInterval);
  slideInterval = setTimeout(showNextSlide, 10000);
}

function showNextSlide() {
  showSlide();
}
  
function setLineWidthGender(){

const margin = 30;
const actionWidth = document.getElementById('action').offsetWidth;
const fantasyWidth = document.getElementById('fantasy').offsetWidth + actionWidth + margin;
const horrorHorror = document.getElementById('horror').offsetWidth + fantasyWidth + margin;
const comedyWidth = document.getElementById('comedy').offsetWidth + horrorHorror + margin;
const adventureWidth = document.getElementById('adventure').offsetWidth + comedyWidth + margin;

document.getElementById('action').addEventListener('click', function() {
  var lineGenderElement = document.querySelector('.lineGender');
    lineGenderElement.style.setProperty('--gradient-size', `${actionWidth}px`);
    lineGenderElement.classList.add('expanded');
});

document.getElementById('fantasy').addEventListener('click', function() {
  var lineGenderElement = document.querySelector('.lineGender');
  lineGenderElement.style.setProperty('--gradient-size', `${fantasyWidth}px`);
  lineGenderElement.classList.add('expanded');
});

document.getElementById('horror').addEventListener('click', function() {
  var lineGenderElement = document.querySelector('.lineGender');
  lineGenderElement.style.setProperty('--gradient-size', `${horrorHorror}px`);
  lineGenderElement.classList.add('expanded');
});

document.getElementById('comedy').addEventListener('click', function() {
  var lineGenderElement = document.querySelector('.lineGender');
  lineGenderElement.style.setProperty('--gradient-size', `${comedyWidth}px`);
  lineGenderElement.classList.add('expanded');
});

document.getElementById('adventure').addEventListener('click', function() {
  var lineGenderElement = document.querySelector('.lineGender');
  lineGenderElement.style.setProperty('--gradient-size', `${adventureWidth}px`);
  lineGenderElement.classList.add('expanded');
});

}
function setLineWidth(){
const lineMainElements = document.querySelectorAll('.lineMain');

lineMainElements.forEach((lineMainElement, index) => {
 
  const h1TextWidth = document.querySelectorAll('h1')[index].offsetWidth;
 
  lineMainElement.style.setProperty('--gradient-size', `${h1TextWidth}px`);
  lineMainElement.classList.add('expanded');
});
}