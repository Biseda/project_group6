import { useState, useEffect } from 'react';

const useComments = (id) => {
  const [comments, setComments] = useState([]);
  const [likeDislike, setLikeDislike] = useState(null);

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem(`comments-${id}`));
    if (storedComments) {
      setComments(storedComments);
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
  }, [id, comments]);

  useEffect(() => {
    const storedLikeDislike = localStorage.getItem(`likeDislike-${id}`);

    if (storedLikeDislike) {
      setLikeDislike(storedLikeDislike);
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`likeDislike-${id}`, likeDislike);
  }, [id, likeDislike]);

  const handleSubmitComment = (comment, movieId) => {
    const newComment = {
      movieId: movieId,
      comment: comment,
      timestamp: new Date().toLocaleString(), // Add timestamp with current date and time
    };
    setComments([...comments, newComment]);
  };

  const handleLikeDislike = (action) => {
    if (likeDislike === action) {
      setLikeDislike(null);
    } else {
      setLikeDislike(action);
    }
  };

  return {
    comments,
    likeDislike,
    handleSubmitComment,
    handleLikeDislike,
    setComments,
  };
};

export default useComments;