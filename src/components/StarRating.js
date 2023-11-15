import React, { useState } from 'react';

const StarRating = ({ onRatingSelected }) => {
    const [selectedRating, setSelectedRating] = useState(0);

    const handleStarClick = (rating) => {
        setSelectedRating(rating);
        onRatingSelected(rating);
    };

    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    style={{ color: star <= selectedRating ? 'gold' : 'gray' }}
                    onClick={() => handleStarClick(star)}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;
