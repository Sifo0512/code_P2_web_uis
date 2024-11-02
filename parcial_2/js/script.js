async function getMarsPhotos(earthDate, page = 1) {
    //Here I declare the url and search for the photos in the API
    const apiKey = 'DEMO_KEY';
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${earthDate}&api_key=${apiKey}&page=${page}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error('Error fetching Mars photos:', error);
        return [];
    }
}

//Variables to handle pagination
let currentPage = 1;
let currentEarthDate = '';

// Function to show photos in the table
function displayPhotos(photos) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; 
    
    photos.forEach(photo => {
        const row = `
            <tr>
                <td>${photo.id}</td>
                <td>${photo.rover.name}</td>
                <td>${photo.camera.name}</td>
                <td>
                    <button onclick="showPhotoDetail('${photo.img_src}', ${photo.id}, ${photo.sol}, '${photo.earth_date}')" id="moreButton">
                        More
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Function to manage navigation between pages
async function handleNavigation(direction) {
    if (direction === 'next') {
        currentPage++;
    } else if (direction === 'previous' && currentPage > 1) {
        currentPage--;
    }
    
    const photos = await getMarsPhotos(currentEarthDate, currentPage);
    displayPhotos(photos);
    
    // Deshabilitar botones de navegación según los resultados
    document.querySelector('#prevButton').disabled = currentPage === 1;
    document.querySelector('#nextButton').disabled = photos.length < 25;

    // Mostrar el detalle de la primera foto en la nueva página si hay resultados
    if (photos.length > 0) {
        const firstPhoto = photos[0];
        showPhotoDetail(firstPhoto.img_src, firstPhoto.id, firstPhoto.sol, firstPhoto.earth_date);
    }
}

// Function to initialize the search
async function initSearch(earthDate) {
    currentEarthDate = earthDate;
    currentPage = 1;
    const photos = await getMarsPhotos(earthDate, currentPage);
    displayPhotos(photos);

    // Deshabilitar botones de navegación según los resultados
    document.querySelector('#prevButton').disabled = true;
    document.querySelector('#nextButton').disabled = photos.length < 25;

    // Mostrar el detalle de la primera foto si hay resultados
    if (photos.length > 0) {
        const firstPhoto = photos[0];
        showPhotoDetail(firstPhoto.img_src, firstPhoto.id, firstPhoto.sol, firstPhoto.earth_date);
    }
}

//Function to show photo detail
function showPhotoDetail(imgSrc, id, sol, earthDate) {
    const photoDetailContainer = document.querySelector('#table_more');
    photoDetailContainer.innerHTML = `
        <h2 class="title_photo">Photo Detail</h2>
        <img src="${imgSrc}" alt="Mars Rover Photo" style="max-width:70%;">
        <p>ID: ${id} Martian Sol: ${sol} Earth Date: ${earthDate}</p>
    `;
}

window.onload = () => {
    const defaultDate = document.getElementById('earthDate').value;
    initSearch(defaultDate);
};
