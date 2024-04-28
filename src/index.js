import axios from "axios";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";

axios.defaults.headers.common[
  "x-api-key"
] = "api_key=live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C";

document.addEventListener("DOMContentLoaded", async () => {
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
        console.error("Error fetching cat by breed:", error);
        Notiflix.Report.failure("Error", "Failed to fetch cat info", "OK");
      }
    },
  });

  try {
    const breeds = await fetchBreeds();
    breedSelect.setData(breeds);
  } catch (error) {
    console.error("Error fetching breeds:", error);
    Notiflix.Report.failure("Error", "Failed to fetch breeds", "OK");
  }
});

async function fetchBreeds() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    return response.data.map((breed) => ({
      value: breed.id,
      text: breed.name,
    }));
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
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
    console.error("Error fetching cat by breed:", error);
    throw error;
  }
}

function renderCatInfo(cat) {
  document.getElementById("cat-breed").textContent = cat.breed;
  document.getElementById("cat-description").textContent = `Description: ${cat.description}`;
  document.getElementById("cat-temperament").textContent = `Temperament: ${cat.temperament}`;
  document.getElementById("cat-image").src = cat.imageUrl;
  document.getElementById("cat-info").style.display = "block";
}