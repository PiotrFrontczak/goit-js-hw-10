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

async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    console.log('Breeds:', response.data); // Log the response data
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
    console.log('Cat info:', response.data); // Log the response data
    // Remaining code...
  } catch (error) {
    handleFetchError(error, 'Failed to fetch cat info');
    throw error;
  }
}

function handleFetchError(error, message) {
  console.error('Error:', error);
  Notiflix.Report.failure('Error', message, 'OK');
}

function renderCatInfo(cat) {
  const catInfoContainer = document.querySelector('.cat-info');
  catInfoContainer.innerHTML = ''; 

  const catImage = document.createElement('img');
  catImage.src = cat.imageUrl;
  catImage.alt = cat.breed;
  catInfoContainer.appendChild(catImage);

  const catBreed = document.createElement('h2');
  catBreed.textContent = cat.breed;
  catInfoContainer.appendChild(catBreed);

  const catDescription = document.createElement('p');
  catDescription.textContent = `Description: ${cat.description}`;
  catInfoContainer.appendChild(catDescription);

  const catTemperament = document.createElement('p');
  catTemperament.textContent = `Temperament: ${cat.temperament}`;
  catInfoContainer.appendChild(catTemperament);

  catInfoContainer.style.display = 'block';
}

function populateBreedSelect(breeds) {
  const breedSelect = document.getElementById('breed-select');
  if (!breedSelect) {
    console.error('Breed select element not found');
    return;
  }

  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}
