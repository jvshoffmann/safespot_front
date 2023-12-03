import React, { useState, useEffect } from 'react';

import './EstablishmentDetails.css'
import 'font-awesome/css/font-awesome.min.css';

//const apiUrl = 'http://localhost:3000'
const apiUrl = 'https://safespot-d17a40cab9a8.herokuapp.com'

function EstablishmentDetails({  place, currentRating, onRatingSelected, onClose  }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(currentRating || 0);
    const [comment, setComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editReviewId, setEditReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');
    const userId = parseInt(localStorage.getItem('userId'));

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

    const handleEditSubmit = async () => {
        if (editRating > 0 && editComment.trim()) {
            const response = await fetch(`${apiUrl}/api/review/${editReviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    rating: editRating,
                    comment: editComment
                })
            });
    
            const data = await response.json();
            if (data.success) {
                // Atualize a lista de avaliações
                const updatedReviews = reviews.map(review => {
                    if (review.id === editReviewId) {
                        return { ...review, rating: editRating, comment: editComment };
                    }
                    return review;
                });
                setReviews(updatedReviews);
                setIsEditModalOpen(false);
            } else {
                alert(data.message);
            }
        } else {
            alert("Por favor, escolha uma classificação e adicione um comentário.");
        }
    };
    

    const editReview = (reviewId) => {
        const reviewToEdit = reviews.find(review => review.id === reviewId);
        if (reviewToEdit) {
            setEditReviewId(reviewId);
            setEditRating(reviewToEdit.rating);
            setEditComment(reviewToEdit.comment);
            setIsEditModalOpen(true);
        }
    };
    
    
    const deleteReview = async (reviewId) => {
        if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
            const response = await fetch(`${apiUrl}/api/review/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
    
            const data = await response.json();
            if (data.success) {
                // Remova a avaliação da lista de reviews
                setReviews(reviews.filter(review => review.id !== reviewId));
            } else {
                alert(data.message);
            }
        }
    };

    // Calcular a classificação média
    useEffect(() => {
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalReviews ? totalRating / totalReviews : 0;
        setAverageRating(avgRating.toFixed(1));
    }, [reviews]);
    const isLoggedIn = localStorage.getItem('authToken') ? true : false;
    return (
        <div className="establishment-details">
            <button onClick={onClose} className="close-button">×</button>
            <h2>{place.name}</h2>
            <p>{place.formatted_address}</p>
            <h4>Avaliação média: {averageRating} 🌟</h4>

            <div className="add-review-container">
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
                {isLoggedIn ? (
                    <button className="send-review" onClick={handleSubmit}>Enviar Avaliação</button>

                ) : (
                    <p>Gostaria de avaliar? Por favor, faça login ou crie uma conta para contribuir com sua opinião.</p>
                )}
            </div>
            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsEditModalOpen(false)}>&times;</span>
                        <h3>Editar Avaliação</h3>
                        {[1, 2, 3, 4, 5].map(star => (
                            <i
                                key={star}
                                className={`fa star ${editRating >= star ? 'fa-star' : 'fa-star-o'}`}
                                onClick={() => setEditRating(star)}
                            />
                        ))}
                        <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Edite seu comentário aqui..."
                        />
                        <button onClick={handleEditSubmit}>Atualizar Avaliação</button>
                    </div>
                </div>
            )}           
            <div className="reviews-container">
                <h3>Avaliações</h3>
                {reviews.map(review => (
                    <div key={review.id} className="review-item">
                        <strong>{review.rating} 🌟 - {review.username}</strong>
                        <p>{review.comment}</p>
                        {userId === review.user_id && (
                            <div className="review-actions">
                                <button className="icon-button" onClick={() => editReview(review.id)} title="Editar">
                                    <i className="fa fa-pencil"></i>
                                </button>
                                <button className="icon-button" onClick={() => deleteReview(review.id)} title="Deletar">
                                    <i className="fa fa-trash"></i>
                                </button>
                          </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EstablishmentDetails;
