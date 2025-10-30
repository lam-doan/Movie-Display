import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [userInput, setUserInput] = useState("");
  
  const handleFetch = (pageNumber = 1) => {
    fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNumber}&api_key=59b7fc8fa6bb0508f7378ba1d36a114a`)
      .then(res => res.json())
      .then(data => {
          setMovies(data.results);
          setPage(pageNumber);
          setTotalPages(data.total_pages);
        }
      )
      .catch(err => console.error(err));
  }

  useEffect(() => {
    handleFetch(1);
  }, []);

  const handleNext = () => {
    handleFetch(page+1);
  }

  const handlePrev = () => {
    if (page > 1) {
      handleFetch(page-1);
    }
  }

  const handleSearch = (e) => {
    setUserInput(e.target.value);
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=59b7fc8fa6bb0508f7378ba1d36a114a&query=${encodeURIComponent(e.target.value)}&include_adult=false&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results);
        setPage(1);
        setTotalPages(data.total_pages);
      })
      .catch(err => {
        console.log("Movie not found: ", err);
        setMovies([]);
      })
  }

  const handleSort = (e) => {
    const sort_type = e.target.value;
    
    fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=59b7fc8fa6bb0508f7378ba1d36a114a&page=1`)
      .then(res => res.json())
      .then(data => {
        let movie_list = data.results;
        if (sort_type === "release-date-asc") {
          movie_list.sort((movie_a, movie_b) => new Date(movie_a.release_date) - new Date(movie_b.release_date));
        } else if (sort_type === "release-date-desc") {
          movie_list.sort((movie_a, movie_b) => new Date(movie_b.release_date) - new Date(movie_a.release_date));
        } else if (sort_type === "rating-asc") {
          movie_list.sort((movie_a, movie_b) => movie_a.vote_average - movie_b.vote_average);
        } else if (sort_type === "rating-desc") {
          movie_list.sort((movie_a, movie_b) => movie_b.vote_average - movie_a.vote_average);
        } 
        setMovies(movie_list);
      })
      .catch(err => console.error(err));
  }
  
  return (
    <div className="App">
      <p id="title">Movie Explorer</p>
      <div className="menu">
        <input type='text'
        value={userInput} 
        placeholder='Search for a movie...'
        onChange={handleSearch}/>
        <select id="sort-order" onChange={handleSort}>
          <option value="sort-by">Sort By</option>
          <option value="release-date-asc">Release Date (Asc)</option>
          <option value="release-date-desc">Release Date (Desc)</option>
          <option value="rating-asc">Rating (Asc)</option>
          <option value="rating-desc">Rating (Desc)</option>
        </select>
      </div>
      <div className='movies'>
        {movies.map((movie, index) => (
          <div key={index} className='movie-card'>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}/>
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
          </div>
        ))}
      </div>
      <div className='pagination'>
        <button className='pagination-btn' onClick={handlePrev}>Previous</button>
        <span id='page'>Page {page} of {totalPages}</span>
        <button className='pagination-btn' onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default App;
