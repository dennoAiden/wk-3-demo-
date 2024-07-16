const movieList = document.getElementById('films');
const movieDetails = document.getElementById('movie-details');
let moviesData = []; 

const placeholderLi = document.querySelector('#films .film_item');
if (placeholderLi) {
  placeholderLi.remove();
}
fetch('http://localhost:3000/films')
  .then(response => response.json())
  .then(movies => {
    moviesData = movies; 
    displayMoviesList(movies);
    displayMovieDetails(movies[0]);
  })
function displayMoviesList(movies) {
  movieList.innerHTML = ''; 
  movies.forEach(movie => {
    const movieItem = document.createElement('li');
    movieItem.className = 'film item';
    movieItem.textContent = movie.title;
    movieItem.addEventListener('click', () => {
      displayMovieDetails(movie);
    });
    movieList.appendChild(movieItem);
  });
}

function displayMovieDetails(movie) {
  const availableTickets = (movie.capacity - movie.tickets_sold);
  movieDetails.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${movie.poster}" alt="${movie.title} poster">
    <p>${movie.description}</p>
    <p>Runtime: ${movie.runtime} minutes</p>
    <p>Showtime: ${movie.showtime}</p>
    <p>Available Tickets: <span id="ticket-count">${availableTickets}</span></p>
    <button id="purchase-button">Purchase Ticket</button>
  `;

  const purchaseButton = document.getElementById('purchase-button');
  purchaseButton.addEventListener('click', () => purchaseTicket(movie));
}
function purchaseTicket(movie) {
  if (movie.capacity - movie.tickets_sold > 0) {
    fetch(`http://localhost:3000/films/${movie.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tickets_sold: movie.tickets_sold + 1
      })
    })
    .then(response => response.json())
    .then(updatedMovie => {
      document.getElementById('ticket-count').textContent = updatedMovie.capacity - updatedMovie.tickets_sold;
      movie.tickets_sold = updatedMovie.tickets_sold;
    })
    .catch(error => console.error('Error purchasing ticket:', error));
  } else {
    alert('No tickets available!');
  }
}
