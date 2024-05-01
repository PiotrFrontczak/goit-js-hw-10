import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C';

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

export { fetchBreeds, fetchCatByBreed };
