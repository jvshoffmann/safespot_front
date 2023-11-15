import React, { Component } from 'react';
import './Map.css'
import TopMenu from './TopMenu.js';
import EstablishmentDetails from './EstablishmentDetails';
import StarRating from './StarRating';
import './EstablishmentDetails.css';
import 'font-awesome/css/font-awesome.min.css';



class MapContainer extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          selectedPlaceDetails: null,
          rating: 0
        };
      }
  mapRef = React.createRef();

  componentDidMount() {
    this.loadGoogleMapScript();
  }

  loadGoogleMapScript() {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA2pEHW5yBs6BICZAw0u65ykJ1iHXsG_to&libraries=places&callback=initMap`;

      script.defer = true;
      script.async = true;

      script.onload = () => {
        this.initMap();
      };

      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  }

handleRatingSelected = (rating) => {
    this.setState({ rating });
};



searchPlaces = () => {
    const query = document.getElementById('place-search').value;

    if (query) {
        this.autocompleteService.getPlacePredictions({ input: query }, this.displayResults);
    }
};

displayResults = (predictions, status) => {
    const resultsDiv = document.getElementById('autocomplete-results');
    resultsDiv.innerHTML = ''; // Limpar os resultados anteriores

    if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
        return;
    }

    predictions.forEach(prediction => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerText = prediction.description;
        resultItem.onclick = () => this.selectPlace(prediction.place_id);
        resultsDiv.appendChild(resultItem);
    });
};


selectPlace = (placeId) => {
  const placesService = new window.google.maps.places.PlacesService(this.map);
  placesService.getDetails({ placeId }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          this.map.setCenter(result.geometry.location);
          new window.google.maps.Marker({
              map: this.map,
              position: result.geometry.location
          });

          this.setState({ selectedPlaceDetails: result });
      }
  });

  // Esconde o contêiner de resultados após um local ter sido selecionado
  document.getElementById('autocomplete-results').style.display = 'none';
};







initMap() {
  const defaultLocation = { lat: 37.7749, lng: -122.4194 };
  this.autocompleteService = new window.google.maps.places.AutocompleteService();
  const initMapServices = (location) => {
      this.map = new window.google.maps.Map(this.mapRef.current, {
          center: location,
          zoom: 14,
      });
      this.placesService = new window.google.maps.places.PlacesService(this.map);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
          initMapServices({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
          initMapServices(defaultLocation);
      }
    );
  } else {
      initMapServices(defaultLocation);
  }
}

handleRatingSelected(rating) {
    
    this.setState({ currentRating: rating });
}


  ''
  render() {
  
    
    return (
        
        <div className="map-page-container">
            <TopMenu />
            <div className="autocomplete-container">
              <input
                  id="place-search"
                  type="text"
                  placeholder="Buscar estabelecimentos..."
                  onInput={this.searchPlaces}
              />
              <div id="autocomplete-results" className="autocomplete-results"></div>
          </div>

          {this.state.selectedPlaceDetails && (
           <EstablishmentDetails 
                place={this.state.selectedPlaceDetails}
                currentRating={this.state.currentRating}
                onRatingSelected={(rating) => this.handleRatingSelected(rating)}
            />



            
                
)}
            <div ref={this.mapRef} className="map-container" />
        </div>
        
    );
}

}

export default MapContainer;
