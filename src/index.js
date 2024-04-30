import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'api_key=live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C';

document.addEventListener('DOMContentLoaded', async () => {
  const loader = document.querySelector('.loader');
  const breedSelect = document.getElementById('breed-select');
  const catInfoContainer = document.querySelector('.cat-info');
  const errorElement = document.querySelector('.error');

  if (!loader || !breedSelect || !catInfoContainer || !errorElement) {
    console.error('Required DOM elements not found');
    return;
  }

  try {
    const breeds = await fetchBreeds(loader, breedSelect);
    populateBreedSelect(breeds, breedSelect); // Populate the breed select with the fetched data
  } catch (error) {
    handleFetchError(error, 'Failed to fetch breeds', errorElement);
  }
});

async function fetchBreeds(loader, breedSelect) {
  loader.style.display = 'block';
  breedSelect.style.display = 'none';

  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    loader.style.display = 'none';
    breedSelect.style.display = 'block';
    return response.data.map(breed => ({
      value: breed.id,
      text: breed.name,
    }));
  } catch (error) {
    handleFetchError(error, 'Failed to fetch breeds');
    throw error;
  }
}

async function fetchCatByBreed(breedId) {
  const loader = document.querySelector('.loader');
  const catInfoContainer = document.querySelector('.cat-info');
  loader.style.display = 'block';
  catInfoContainer.style.display = 'none';

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
  } finally {
    loader.style.display = 'none';
  }
}

function handleFetchError(error, message, errorElement) {
  console.error('Error:', error);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
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

function populateBreedSelect(breeds, breedSelect) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.value;
    option.textContent = breed.text;
    breedSelect.appendChild(option);
  });
}