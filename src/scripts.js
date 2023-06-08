async function getPopularAnimes() {
    const queryUrl = 'https://graphql.anilist.co';
  
    const query = `
      query ($perPage: Int, $page: Int) {
        Page(perPage: $perPage, page: $page) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
          }
        }
      }
    `;
  
    const variables = {
      perPage: 50,
      page: 1
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
  
      const animeList = data.data.Page.media;
      
      const container = document.querySelector('.containerAnimes');
      for (const anime of animeList) {
        const { id, title, coverImage } = anime;
        const imageUrl = coverImage ? coverImage.large : 'N/A';
  
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = id;
        card.onclick =  function() {
            print(this);
          };

        const image = document.createElement('img');
        image.src = imageUrl;
        card.appendChild(image);
  
        const titleElement = document.createElement('h3');
        titleElement.textContent = title.romaji || title.english;
        card.appendChild(titleElement);
  
        container.appendChild(card);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  getPopularAnimes();
  function print(e){
    console.log(e);
  }