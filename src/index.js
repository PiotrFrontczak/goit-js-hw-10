import axios from "axios";

// Ustawienie nagłówka z kluczem API dla wszystkich żądań
axios.defaults.headers.common["x-api-key"] = "live_VKCIRihYeFRPBwlrljopUQAx3HyZ6OnssyhvlIi4631GwHhUN0m1HJxXe98yCq1C";

document.addEventListener("DOMContentLoaded", async () => {
  const breedSelect = document.querySelector(".breed-select");
  const catInfoContainer = document.querySelector(".cat-info");
  const loader = document.querySelector(".loader");
  const error = document.querySelector(".error");

  const renderBreeds = breeds => {
    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  };

  const renderCatInfo = cat => {
    catInfoContainer.innerHTML = `
      <img src="${cat.imageUrl}" alt="${cat.breed}" />
      <h2>${cat.breed}</h2>
      <p><strong>Description:</strong> ${cat.description}</p>
      <p><strong>Temperament:</strong> ${cat.temperament}</p>
    `;
  };

  try {
    loader.style.display = "block";
    const breeds = await fetchBreeds();
    loader.style.display = "none";
    renderBreeds(breeds);

    breedSelect.addEventListener("change", async event => {
      const breedId = event.target.value;
      loader.style.display = "block";
      catInfoContainer.style.display = "none";
      try {
        const cat = await fetchCatByBreed(breedId);
        loader.style.display = "none";
        catInfoContainer.style.display = "block";
        renderCatInfo(cat);
      } catch (error) {
        console.error("Error fetching cat by breed:", error);
      }
    });
  } catch (error) {
    console.error("Error fetching breeds:", error);
  }
});

// Funkcja do pobierania listy ras
async function fetchBreeds() {
  document.querySelector(".breed-select").style.display = "none";
  document.querySelector(".cat-info").style.display = "none";
  document.querySelector(".loader").style.display = "block";

  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".breed-select").style.display = "block";
    return response.data.map(breed => ({
      id: breed.id,
      name: breed.name
    }));
  } catch (error) {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".error").style.display = "block";
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

// Funkcja do pobierania informacji o kocie na podstawie identyfikatora rasy
async function fetchCatByBreed(breedId) {
  document.querySelector(".cat-info").style.display = "none";
  document.querySelector(".loader").style.display = "block";

  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".cat-info").style.display = "block";

    if (!response.data || response.data.length === 0) {
      throw new Error("Cat information not found");
    }

    const catInfo = response.data[0];
    if (!catInfo || !catInfo.breeds || catInfo.breeds.length === 0) {
      throw new Error("Cat information not found");
    }

    const cat = {
      breed: catInfo.breeds[0].name,
      description: catInfo.breeds[0].description || "No description available",
      temperament: catInfo.breeds[0].temperament || "No temperament available",
      imageUrl: catInfo.url
    };
    return cat;
  } catch (error) {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".error").style.display = "block";
    console.error("Error fetching cat by breed:", error);
    throw error;
  }
}
