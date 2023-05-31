import { useState, useEffect } from 'react';

const useComments = (id) => {
  const [comments, setComments] = useState([]); // State för kommentarer
  const [likeDislike, setLikeDislike] = useState(null); // State för gilla/ogilla

  useEffect(() => {
    // Hämta sparade kommentarer från localStorage vid montering av komponenten
    const storedComments = JSON.parse(localStorage.getItem(`comments-${id}`));
    if (storedComments) {
      setComments(storedComments);
    }
  }, [id]);

  useEffect(() => {
    // Spara kommentarer i localStorage vid ändringar av kommentar-state eller ID
    localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
  }, [id, comments]);

  useEffect(() => {
    // Hämta sparad gilla/ogilla-information från localStorage vid montering av komponenten
    const storedLikeDislike = localStorage.getItem(`likeDislike-${id}`);

    if (storedLikeDislike) {
      setLikeDislike(storedLikeDislike);
    }
  }, [id]);

  useEffect(() => {
    // Spara gilla/ogilla-information i localStorage vid ändringar av gilla/ogilla-state eller ID
    localStorage.setItem(`likeDislike-${id}`, likeDislike);
  }, [id, likeDislike]);

  const handleSubmitComment = (comment, movieId) => {
    // Hantera inskickad kommentar och lägg till den i kommentarlistan
    const newComment = {
      movieId: movieId,
      comment: comment,
    };
    setComments([...comments, newComment]);
  };

  const handleLikeDislike = (action) => {
    // Hantera gilla/ogilla-funktionen
    if (likeDislike === action) {
      setLikeDislike(null);
    } else {
      setLikeDislike(action);
    }
  };

  // Returnera kommentarer, gilla/ogilla-information och relevanta hanteringsfunktioner
  return {
    comments,
    likeDislike,
    handleSubmitComment,
    handleLikeDislike,
    setComments,
  };
};

export default useComments;
