import axios from 'axios';

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

export { fetchBreeds };