// Simulated database of medical facilities
const medicalFacilities = [
    {
        name: 'Hospital São Lucas',
        type: 'Hospital',
        rating: 4.5,
        position: { lat: -23.550520, lng: -46.633308 }, // São Paulo coordinates
        specialists: ['Clínico Geral', 'Cardiologista', 'Neurologista'],
        address: 'Av. Paulista, 1000'
    },
    {
        name: 'Clínica Saúde Total',
        type: 'Clínica',
        rating: 4.2,
        position: { lat: -23.551520, lng: -46.634308 },
        specialists: ['Clínico Geral', 'Pediatra', 'Ortopedista'],
        address: 'Rua Augusta, 500'
    },
    {
        name: 'UBS Central',
        type: 'UBS',
        rating: 4.0,
        position: { lat: -23.552520, lng: -46.635308 },
        specialists: ['Clínico Geral', 'Enfermeiro', 'Ginecologista'],
        address: 'Rua da Consolação, 200'
    }
];

class HealthMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.userLocation = null;
    }

    async initMap() {
        try {
            // Create info window
            this.infoWindow = new google.maps.InfoWindow();

            // Try to get user's location
            const position = await this.getCurrentLocation();
            
            // Initialize map centered on user's location or default location
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: position,
                zoom: 14,
                styles: this.getMapStyles(),
                mapTypeControl: false,
                fullscreenControl: false
            });

            // Add user marker
            this.addUserMarker(position);

            // Add medical facilities markers
            this.addMedicalFacilities();

            // Add search box
            this.addSearchBox();

        } catch (error) {
            console.error('Error initializing map:', error);
            // If geolocation fails, center on default location
            this.initMapWithDefaultLocation();
        }
    }

    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(this.userLocation);
                    },
                    () => {
                        // Default to São Paulo coordinates if geolocation is denied
                        this.userLocation = { lat: -23.550520, lng: -46.633308 };
                        resolve(this.userLocation);
                    }
                );
            } else {
                // Default to São Paulo coordinates if geolocation is not supported
                this.userLocation = { lat: -23.550520, lng: -46.633308 };
                resolve(this.userLocation);
            }
        });
    }

    initMapWithDefaultLocation() {
        const defaultLocation = { lat: -23.550520, lng: -46.633308 }; // São Paulo
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: defaultLocation,
            zoom: 14,
            styles: this.getMapStyles(),
            mapTypeControl: false,
            fullscreenControl: false
        });
        this.addMedicalFacilities();
    }

    addUserMarker(position) {
        const userMarker = new google.maps.Marker({
            position: position,
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
            },
            title: 'Sua localização'
        });

        userMarker.addListener('click', () => {
            this.infoWindow.setContent('Sua localização atual');
            this.infoWindow.open(this.map, userMarker);
        });
    }

    addMedicalFacilities() {
        medicalFacilities.forEach(facility => {
            const marker = new google.maps.Marker({
                position: facility.position,
                map: this.map,
                title: facility.name,
                icon: {
                    url: this.getFacilityIcon(facility.type),
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            marker.addListener('click', () => {
                const content = this.createInfoWindowContent(facility);
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
        });
    }

    getFacilityIcon(type) {
        // Return appropriate Font Awesome icon URL based on facility type
        switch (type.toLowerCase()) {
            case 'hospital':
                return 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/hospital.svg';
            case 'clínica':
                return 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/clinic-medical.svg';
            case 'ubs':
                return 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/first-aid.svg';
            default:
                return 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/hospital.svg';
        }
    }

    createInfoWindowContent(facility) {
        return `
            <div class="p-3 max-w-sm">
                <h3 class="text-lg font-semibold">${facility.name}</h3>
                <p class="text-sm text-gray-600">${facility.type}</p>
                <p class="text-sm">${facility.address}</p>
                <div class="mt-2">
                    <div class="flex items-center">
                        ${this.getStarRating(facility.rating)}
                    </div>
                </div>
                <div class="mt-2">
                    <strong class="text-sm">Especialidades:</strong>
                    <p class="text-sm">${facility.specialists.join(', ')}</p>
                </div>
                <div class="mt-3">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${facility.position.lat},${facility.position.lng}"
                       target="_blank"
                       class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm inline-block hover:bg-blue-600">
                        Como chegar
                    </a>
                </div>
            </div>
        `;
    }

    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star text-yellow-400"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
            } else {
                stars += '<i class="far fa-star text-yellow-400"></i>';
            }
        }
        
        return stars + `<span class="ml-1 text-sm text-gray-600">${rating}</span>`;
    }

    addSearchBox() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Buscar local...';
        input.className = 'controls';
        input.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 400px;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            font-size: 14px;
        `;

        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        const searchBox = new google.maps.places.SearchBox(input);

        this.map.addListener('bounds_changed', () => {
            searchBox.setBounds(this.map.getBounds());
        });

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (places.length === 0) return;

            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
                if (!place.geometry || !place.geometry.location) return;

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            this.map.fitBounds(bounds);
        });
    }

    getMapStyles() {
        return [
            {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            }
        ];
    }
}

// Initialize map when Google Maps API is loaded
function initMap() {
    window.healthMap = new HealthMap();
    window.healthMap.initMap();
}

// Add error handler for Google Maps API
function gm_authFailure() {
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100">
            <div class="text-center p-4">
                <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-2"></i>
                <p class="text-gray-700">Não foi possível carregar o mapa. Por favor, verifique sua conexão.</p>
            </div>
        </div>
    `;
}
