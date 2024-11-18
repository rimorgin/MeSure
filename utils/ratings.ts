export const ratingStars = (rating: number): string => {
  if (rating < 1 || rating > 5) {
    return ''; // Handle cases where rating is outside the valid range
  }
  return '★'.repeat(rating);
};