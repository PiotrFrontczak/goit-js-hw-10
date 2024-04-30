import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'api_key=live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch the list of cat breeds
    const breeds = await fetchBreeds();
    // Populate the breed select dropdown with fetched data
    populateBreedSelect(breeds);
  } catch (error) {
    // Handle error in fetching breeds
    handleFetchError(error, 'Failed to fetch breeds');
  }
  
  // Add event listener for breed selection
  const breedSelect = document.getElementById('breed-select');
  breedSelect.addEventListener('change', async (event) => {
    const breedId = event.target.value;
    try {
      // Fetch cat information for the selected breed
      const catInfo = await fetchCatByBreed(breedId);
      // Render cat information
      renderCatInfo(catInfo);
    } catch (error) {
      // Error handling for fetching cat info
    }
  });
});

// Function to fetch the list of cat breeds
async function fetchBreeds() {
  const response = await axios.get('https://api.thecatapi.com/v1/breeds');
  return response.data.map(breed => ({
    value: breed.id,
    text: breed.name,
  }));
}

// Function to fetch cat information by breed ID
async function fetchCatByBreed(breedId) {
  try {
    console.log('Fetching cat info for breed ID:', breedId);

    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );

    console.log('Cat info response:', response);

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
    console.error('Error fetching cat info:', error);
    handleFetchError(error, 'Failed to fetch cat info');
    throw error;
  }
}


// Function to handle fetch errors
function handleFetchError(error, message) {
  console.error('Error:', error);
  Notiflix.Report.failure('Error', message, 'OK');
}

// Function to render cat information
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

// Function to populate the breed select dropdown
function populateBreedSelect(breeds) {
  const breedSelect = document.getElementById('breed-select');
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.value;
    option.textContent = breed.text;
    breedSelect.appendChild(option);
  });
}