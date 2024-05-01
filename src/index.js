import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
  } catch (error) {
    handleFetchError(error, 'Failed to fetch breeds');
  }
});

async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data.map(breed => ({
      id: breed.id,
      name: breed.name,
    }));
  } catch (error) {
    throw error;
  }
}

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    return response.data[0];
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
  catInfoContainer.innerHTML = '';

  const catImage = document.createElement('img');
  catImage.src = cat.url;
  catImage.alt = cat.breeds[0].name;
  catInfoContainer.appendChild(catImage);

  const catBreed = document.createElement('h2');
  catBreed.textContent = cat.breeds[0].name;
  catInfoContainer.appendChild(catBreed);

  const catDescription = document.createElement('p');
  catDescription.textContent = `Description: ${
    cat.breeds[0].description || 'N/A'
  }`;
  catInfoContainer.appendChild(catDescription);

  const catTemperament = document.createElement('p');
  catTemperament.textContent = `Temperament: ${
    cat.breeds[0].temperament || 'N/A'
  }`;
  catInfoContainer.appendChild(catTemperament);

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

  breedSelect.addEventListener('change', async event => {
    const selectedBreedId = event.target.value;
    try {
      const cat = await fetchCatByBreed(selectedBreedId);
      renderCatInfo(cat);
    } catch (error) {
      handleFetchError(error, 'Failed to fetch cat info');
    }
  });
}