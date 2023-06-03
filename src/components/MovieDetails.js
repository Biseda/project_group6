import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import RelatedBook from './RelatedBook';
import useComments from './useComments';

const API_KEY = '0d79d730fff942862b97a7f954332e81';

const MovieDetails = ({ movies }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comment, setComment] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  
  const { comments, likeDislike, handleSubmitComment, handleLikeDislike, setComments } = useComments(id);

  const handleDeleteComments = () => {
    setComments([]);
    localStorage.removeItem(`comments-${id}`);
    setShowDeleteButton(false);
  };

  const onSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      handleSubmitComment(comment, id);
      setComment('');
      setShowDeleteButton(true);
    }
  };

  useEffect(() => {
    const selectedMovie = movies.find((movie) => movie.id.toString() === id);

    if (selectedMovie) {
      setMovie(selectedMovie);
    } else {
      const fetchMovie = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
          const data = await response.json();

          if (response.ok) {
            const fetchedMovie = {
              id: data.id,
              title: data.title,
              overview: data.overview,
              poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
              releaseYear: data.release_date ? data.release_date.substring(0, 4) : 'Okänt år',
              voteAverage: data.vote_average ? data.vote_average : 'N/A',
            };

            setMovie(fetchedMovie);
          } else {
            throw new Error('Filmen hittades inte');
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchMovie();
    }
  }, [id, movies]);

  if (!movie) {
    return <h2>Filmen hittades inte</h2>;
  }

  return (
    <div className="movie-details-container">
      <Row>
        <Col xs={12} md={4}>
          <img className="card-img-top" style={{ width: '15rem' }} src={movie.poster} alt={movie.title} />

          <div>
            <p>{likeDislike === 'like' ? 'Like: 1' : likeDislike === 'dislike' ? 'Dislike: 1' : ''}</p>
            <button onClick={() => handleLikeDislike('like')}>
              {likeDislike === 'like' ? 'Sluta gilla' : 'Gilla'}
            </button>
            <button onClick={() => handleLikeDislike('dislike')}>
              {likeDislike === 'dislike' ? 'Sluta ogilla' : 'Ogilla'}
            </button>
          </div>
          <br></br>
        </Col>
        <Col xs={12} md={8}>
          <div>
            <h3>{movie.title}</h3>
            <p>Utgivningsår: {movie.releaseYear}</p>
            <p>Regissör: {movie.director}</p>
            <h5>Genomsnittligt betyg: {movie.voteAverage}</h5>
            <br />
            <h6>Översikt</h6>
            <p>{movie.overview}</p>
            <br />
          </div>
        </Col>
        <RelatedBook movie={movie} />
      </Row>

      <div className="comments-section">
        <label htmlFor="comment" className="comment-label">Kommentar:</label>
        <form onSubmit={onSubmitComment}>
          <div className="form-group">
            <input
              type="text"
              id="comment"
              className="form-control"
              placeholder="Lämna en kommentar"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="button-group">
              <button type="submit" className="btn btn-primary">Lägg till kommentar</button>
              {showDeleteButton && (
                <button className="btn btn-primary" onClick={handleDeleteComments}>Radera alla kommentarer</button>
              )}
            </div>
          </div>
        </form>
        <div className="comments-display">
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <div className="comment-content">
                    {comment.comment}
                  </div>
                  <div className="comment-info">
                    <span className="comment-timestamp">
                      {comment.timestamp.toLocaleString('sv-SE')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Inga kommentarer ännu.</p>
          )}

        </div>
      </div>
    </div>
  );  
};

export default MovieDetails;