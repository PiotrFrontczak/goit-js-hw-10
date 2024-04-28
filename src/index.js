import axios from "axios";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";

axios.defaults.headers.common[
  "x-api-key"
] = "api_key=live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C";

const breedSelect = new SlimSelect({
  select: "#breed-select",
  placeholder: "Select a breed",
  onChange: async (val) => {
    const breedId = val.value;
    try {
      Notiflix.Loading.standard("Loading cat info...");
      const cat = await fetchCatByBreed(breedId);
      renderCatInfo(cat);
      Notiflix.Loading.remove();
    } catch (error) {
      handleFetchError(error, "Failed to fetch cat info");
    }
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
    throw error; // Przekaż błąd dalej, aby był obsłużony przez funkcję wywołującą
  }
}

function handleFetchError(error, message) {
  console.error("Error:", error);
  Notiflix.Report.failure("Error", message, "OK");
}


function renderCatInfo(cat) {
  const catBreed = document.getElementById("cat-breed");
  const catDescription = document.getElementById("cat-description");
  const catTemperament = document.getElementById("cat-temperament");
  const catImage = document.getElementById("cat-image");

  catBreed.textContent = cat.breed;
  catDescription.textContent = `Description: ${cat.description}`;
  catTemperament.textContent = `Temperament: ${cat.temperament}`;
  catImage.src = cat.imageUrl;

  document.getElementById("cat-info").style.display = "block";
}

function handleFetchError(error, message) {
  console.error("Error:", error);
  Notiflix.Report.failure("Error", message, "OK");
}