import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'api_key=live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
  } catch (error) {
    handleFetchError(error, 'Failed to fetch breeds');
  }
});

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error('Cat information not found');
    }

    const catInfo = response.data[0];
    if (!catInfo || !catInfo.breeds || catInfo.breeds.length === 0) {
      throw new Error('Cat information not found');
    }

    return {
      breed: catInfo.breeds[0].name,
      description: catInfo.breeds[0].description || 'No description available',
      temperament: catInfo.breeds[0].temperament || 'No temperament available',
      imageUrl: catInfo.url,
    };
  } catch (error) {
    handleFetchError(error, 'Failed to fetch cat info');
    throw error;
  }
}

function handleFetchError(error, message) {
  Notiflix.Report.failure('Error', message, 'OK');
}

function renderCatInfo(cat) {
  const catInfoContainer = document.querySelector('.cat-info');
  catInfoContainer.innerHTML = ''; // Clear previous cat info

  const catBreed = document.createElement('h2');
  catBreed.textContent = cat.breed;
  catInfoContainer.appendChild(catBreed);

  const catDescription = document.createElement('p');
  catDescription.textContent = `Description: ${cat.description}`;
  catInfoContainer.appendChild(catDescription);

  const catTemperament = document.createElement('p');
  catTemperament.textContent = `Temperament: ${cat.temperament}`;
  catInfoContainer.appendChild(catTemperament);

  const catImage = document.createElement('img');
  catImage.src = cat.imageUrl;
  catInfoContainer.appendChild(catImage);

  catInfoContainer.style.display = 'block';
}

function populateBreedSelect(breeds) {
  const breedSelect = document.getElementById('breed-select');
  if (!breedSelect) {
    return;
  }

  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}
