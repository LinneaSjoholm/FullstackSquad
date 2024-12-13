import React from 'react';
import heartIcon from '../assets/Vector (1).png'; 
import heartOutlineIcon from '../assets/heart-outline.png'; 
import "../../src/styles/FavoriteButton.css";


interface FavoriteButtonProps {
  itemId: string;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
  isLoggedIn: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  isFavorite,
  onToggleFavorite,
  isLoggedIn
}) => {
  return (
    <div className='favorite-button'>
    <button
      className="menu-favorite-button"
      onClick={() => onToggleFavorite(itemId)} // Call onToggleFavorite when clicked
      disabled={!isLoggedIn}  // Disable if not logged in
    >
      <img
        // Flip the condition: use outlined heart when NOT a favorite, and filled heart when it IS a favorite
        src={isFavorite ? heartOutlineIcon : heartIcon}
        alt="Heart icon"
        className="heart-icon"
      />
    </button>
    </div>
  );
};

export default FavoriteButton;

