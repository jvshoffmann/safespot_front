import React, { useState, useEffect } from 'react';

import './EstablishmentDetails.css'
import 'font-awesome/css/font-awesome.min.css';

//const apiUrl = 'http://localhost:3000'
const apiUrl = 'https://safespot-d17a40cab9a8.herokuapp.com'

function EstablishmentDetails({  place, currentRating, onRatingSelected  }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(currentRating || 0);
    const [comment, setComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        //console.log(place);
        const ensureEstablishmentExists = async () => {
            try {
                console.log(apiUrl)
                const response = await fetch(`${apiUrl}/api/ensure-establishment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        maps_id: place.place_id,
                        name: place.name,
                        description: '',  
                        address: place.formatted_address
                    })
                });
                //const text = await response.text();
               // console.log("Raw response:", text)
                const data = await response.json();
    
                if (!data.success) {
                    console.error("Erro ao cadastrar/verificar estabelecimento:", data.message);
                    return false;
                }
                return true;
            } catch (error) {
                console.error("Erro ao cadastrar/verificar estabelecimento:", error);
                return false;
            }
        };
    
        const fetchReviews = async () => {
            try {
                console.log('API Base URL:', apiUrl);
                const response = await fetch(`${apiUrl}/api/reviews/${place.place_id}`);
                const data = await response.json();
                
                
                if (data.success) {
                    setReviews(data.reviews);
                } else {
                    console.error("Erro ao buscar avaliações:", data.message);
                }
            } catch (error) {
                console.error("Erro ao buscar avaliações:", error);
            }
        };
    
        if (place) {
            ensureEstablishmentExists().then((exists) => {
                if (exists) {
                    fetchReviews();
                }
            });
        }
    }, [place]);
    

  

    const handleSubmit = async () => {
        if (rating > 0 && comment.trim()) {
            try {
                // Primeiro, obtenha o id do estabelecimento usando o maps_id
                const idResponse = await fetch(`${apiUrl}/api/establishment-id/${place.place_id}`);
            
                const idData = await idResponse.json();
               // console.log(idResponse)
                
                if(!idData.success) {
                    console.error("Erro ao obter ID do estabelecimento:", idData.message);
                    return;
                }
                console.log(idData.id);
                const establishmentId = idData.id;
                
                
                // Agora, envie a avaliação
                const response = await fetch(`${apiUrl}/api/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('authToken')
                        ///'Authorization': localStorage.getItem('token')
                    },
    
                    body: JSON.stringify({
                        //maps_id: establishmentId,
                        establishment_id:establishmentId,
                        rating: rating,
                        comment: comment
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Atualizar a lista de reviews com a nova avaliação
                    setReviews(prevReviews => [...prevReviews, { rating, comment }]);
                    
                    // limpar o rating e o comentário depois de enviar
                    setRating(0);
                    setComment('');
                } else {
                    console.error("Erro ao enviar avaliação:", data.message);
                }
            } catch (error) {
                console.error("Erro ao enviar avaliação:", error);
            }
        } else {
            alert("Por favor, escolha uma classificação e adicione um comentário.");
        }
    };
    

    // Calcular a classificação média
    useEffect(() => {
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalReviews ? totalRating / totalReviews : 0;
        setAverageRating(avgRating.toFixed(1));
    }, [reviews]);

    return (
        <div className="establishment-details">
            <h2>{place.name}</h2>
            <p>{place.formatted_address}</p>
            <h4>Avaliação média: {averageRating} 🌟</h4>

            <div>
                <h3>Adicionar Avaliação</h3>
                {[1, 2, 3, 4, 5].map(star => (
                        <i
                            key={star}
                            className={`fa star ${rating >= star ? 'fa-star' : 'fa-star-o'}`}
                            onClick={() => setRating(star)}
                        />
                    ))}

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicione seu comentário aqui..."
                />
                <button onClick={handleSubmit}>Enviar Avaliação</button>
            </div>

            <div>
                <h3>Avaliações</h3>
                {reviews.map(review => (
                    <div key={review.id}>
                        <strong>{review.rating} 🌟</strong>
                        <p>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EstablishmentDetails;
