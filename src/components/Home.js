import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ movies }) => {
  // Filtrera bort filmer utan en affisch (poster)
  const moviesWithPoster = movies.filter((movie) => movie.poster);

  return (
    <div>
      {moviesWithPoster.length > 0 ? (
        <div className="container">
          <div className="grid">
            {moviesWithPoster.map((movie) => (
              <Link key={movie.id} to={`/movies/${movie.id}`}>
                <div className="card text-center bg-secondary mb-3">
                  <div className="card-body">
                    <img className="card-img-top" src={movie.poster} alt={movie.title} />
                    <div className="card-body">
                      <button type="button" className="btn btn-dark">
                        Visa mer
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <h2>Tyvärr! Inga filmer hittades</h2>
      )}
    </div>
  );
};

export default Home;
