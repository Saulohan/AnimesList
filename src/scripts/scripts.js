const slides = document.querySelectorAll('.banner ul li');
const paginationDots = document.querySelectorAll('.paginationBanner .dot');
let currentSlide = 0;
let slideInterval;

$(document).ready(function() {
  getPopularAnimes();
  showSlide(0);
  slideInterval = setTimeout(showNextSlide, 1000);

});

async function getPopularAnimes() {
  const queryUrl = 'https://kitsu.io/api/edge/anime';

  const params = new URLSearchParams({
    'page[limit]': 20, // Defina o número desejado de animes por página
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
    console.log(animeList)
      

      for (const anime of animeList) {
        const { id, attributes } = anime;
        const {  titles, posterImage, episodeLength , startDate} = attributes;
        const imageUrl = posterImage ? posterImage.original : 'N/A';

        setCardAnime(id, imageUrl, titles, episodeLength, startDate)

      }
    } catch (error) {
      console.log(error);
    }
}

function setCardAnime(id, imageUrl, titles, episodeLength, startDate){
    
  const card = document.createElement('div');
  const container = document.querySelector('.containerAnimes');
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
    
  container.appendChild(card);
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
  
