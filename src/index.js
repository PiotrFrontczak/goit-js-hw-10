import axios from "axios";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";

axios.defaults.headers.common[
  "x-api-key"
] = "api_key=live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C";

const breedSelect = new SlimSelect({
  select: "#breed-select",
  placeholder: "Select a breed",
  values: [], // Pusta tablica jako wartość początkowa
  onChange: async (val) => {
    // Kod obsługi zmiany wartości
  },
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const breeds = await fetchBreeds();
    breedSelect.setData(breeds);
  } catch (error) {
    handleFetchError(error, "Failed to fetch breeds");
  }
});

async function fetchBreeds() {
  const response = await axios.get("https://api.thecatapi.com/v1/breeds");
  return response.data.map((breed) => ({
    value: breed.id,
    text: breed.name,
  }));
}

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("Cat information not found");
    }

    const catInfo = response.data[0];
    if (!catInfo || !catInfo.breeds || catInfo.breeds.length === 0) {
      throw new Error("Cat information not found");
    }

    return {
      breed: catInfo.breeds[0].name,
      description: catInfo.breeds[0].description || "No description available",
      temperament: catInfo.breeds[0].temperament || "No temperament available",
      imageUrl: catInfo.url,
    };
  } catch (error) {
    handleFetchError(error, "Failed to fetch cat info");
    throw error;
  }
}

function handleFetchError(error, message) {
  console.error("Error:", error);
  Notiflix.Report.failure("Error", message, "OK");
}

function renderCatInfo(cat) {
  const catInfoContainer = document.querySelector(".cat-info");
  const catBreed = document.createElement("h2");
  catBreed.textContent = cat.breed;
  catInfoContainer.appendChild(catBreed);

  const catDescription = document.createElement("p");
  catDescription.textContent = `Description: ${cat.description}`;
  catInfoContainer.appendChild(catDescription);

  const catTemperament = document.createElement("p");
  catTemperament.textContent = `Temperament: ${cat.temperament}`;
  catInfoContainer.appendChild(catTemperament);

  const catImage = document.createElement("img");
  catImage.src = cat.imageUrl;
  catInfoContainer.appendChild(catImage);

  catInfoContainer.style.display = "block";
}