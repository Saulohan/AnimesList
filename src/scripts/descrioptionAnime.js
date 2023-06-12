$(document).ready(function() {
    let id = localStorage.getItem('IdAnime');
    console.log(id); // Exibindo o valor na console
    getAnimeById(id);
  });

async function getAnimeById(id) {
    
    const queryUrl = 'https://graphql.anilist.co';

    const query = `
        query ($id: Int) {
        Media(id: $id, type: ANIME) {
            id
            title {
            romaji
            english
            native
            }
            coverImage {
            large
            }
            description
            status
            format
            episodes
            duration
            genres
        }
        }
    `;

    const variables = {
        id: id
    };

    try {
        const response = await fetch(queryUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables
        })
        });

        const data = await response.json();

        if (data.errors) {
        throw new Error(data.errors[0].message);
        }

        const anime = data.data.Media;
        const { title, coverImage, description , status, episodes,  genres } = anime;
        const imageUrl = coverImage ? coverImage.large : 'N/A';
        console.log(anime)

        getImage(id, imageUrl)
        getDescription(title, description, status, episodes, genres)
        
        

    } catch (error) {
        console.log(error);
    }
}

function getImage(id, imageUrl){
    
    const container = document.querySelector('.containerImageAnime');
    const card = document.createElement('div');

    card.classList.add('card');
    card.id = id;

    const image = document.createElement('img');
    image.src = imageUrl;
    card.appendChild(image);

    container.appendChild(card);
}

function getDescription(title, description, status, episodes, genres){
   
    const containerDescription = document.querySelector('.containerImageAnime');
    const descriptionAnime = document.createElement('div');

    const titleElement = document.createElement('h3');
    titleElement.textContent = title.romaji || title.english || title.native;
    descriptionAnime.appendChild(titleElement);

    const descriptionPt = document.createElement('p');
    descriptionPt.textContent = description;
    descriptionAnime.appendChild(descriptionPt);

    const statusElement = document.createElement('p');
    statusElement.textContent = `Status: ${status}`;
    descriptionAnime.appendChild(statusElement);


    const episodesElement = document.createElement('p');
    episodesElement.textContent = `Episódios: ${episodes}`;
    descriptionAnime.appendChild(episodesElement);

    const genresElement = document.createElement('p');
    genresElement.textContent = `Gêneros: ${genres.join(', ')}`;
    descriptionAnime.appendChild(genresElement);
        
    containerDescription.appendChild(descriptionAnime);
}