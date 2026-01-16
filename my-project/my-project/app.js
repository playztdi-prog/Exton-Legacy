const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

// Function to make logos move //
const logos = document.querySelector(".rotating-logos__track")
if (logos) {
    const logosClone = logos.cloneNode(true)
    document.querySelector(".rotating-logos").appendChild(logosClone)
}

// Map functionality //
const locations = [
  {
    id: 1,
    name: "Exton Mall",
    coordinates: [40.0314, -75.6236],
    address: "260 Exton Square",
    city: "Exton",
    state: "PA, US",
    color: "blue"
  },
  {
    id: 2,
    name: "American Helicopter Museum",
    coordinates: [39.991863, -75.578867],
    address: "1220 American Blvd",
    city: "West Chester",
    state: "PA, US",
    color: "red"
  },
  {
    id: 3,
    name: "Exton Park",
    coordinates: [40.0380, -75.6124],
    address: "611 Swedesford Road",
    city: "Exton",
    state: "PA, US",
    color: "green"
  },
  {
    id: 4,
    name: "Church Farm School",
    coordinates: [40.0328, -75.5951],
    address: "1001 Lincoln Hwy",
    city: "Exton",
    state: "PA, US",
    color: "orange"
  }
];

let mapInstance = null;
let markersArray = [];

function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Fix for default marker icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

  // Calculate center point
  const avgLat = locations.reduce((sum, loc) => sum + loc.coordinates[0], 0) / locations.length;
  const avgLng = locations.reduce((sum, loc) => sum + loc.coordinates[1], 0) / locations.length;

  // Create map
  mapInstance = L.map('map').setView([avgLat, avgLng], 11);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  // Create marker group
  const markerGroup = L.featureGroup();

  // Add markers
  locations.forEach((location) => {
    const markerColor = location.color || 'blue';
    const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`;
    const iconRetinaUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`;

    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconRetinaUrl: iconRetinaUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const marker = L.marker(location.coordinates, {
      icon: customIcon
    }).addTo(mapInstance);

    const colorMap = {
      'blue': '007bff',
      'red': 'dc3545',
      'green': '28a745',
      'orange': 'ffc107'
    };

    const borderColor = colorMap[markerColor] || '007bff';

    marker.bindPopup(`
      <div style="padding: 5px; min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 2px solid #${borderColor}; padding-bottom: 5px;">${location.name}</h3>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${location.address}</p>
        <p style="margin: 5px 0;"><strong>City:</strong> ${location.city}</p>
        <p style="margin: 5px 0;"><strong>State:</strong> ${location.state}</p>
      </div>
    `);

    markersArray.push(marker);
    markerGroup.addLayer(marker);
  });

  // Fit bounds
  mapInstance.fitBounds(markerGroup.getBounds().pad(0.1));

  // Open first popup
  if (markersArray.length > 0) {
    markersArray[0].openPopup();
  }

  // Invalidate size
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 100);

  // Populate location cards
  const grid = document.getElementById('locations-grid');
  const count = document.getElementById('location-count');
  
  if (grid && count) {
    count.textContent = `Featured Locations (${locations.length})`;
    grid.innerHTML = locations.map((location) => `
      <div class="location-card" style="padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; border-top: 4px solid #${getColorHex(location.color)};" onclick="jumpToLocation(${location.id - 1})">
        <h4 style="margin: 0 0 0.5rem 0; color: #fff;">${location.name}</h4>
        <p style="margin: 0; font-size: 0.875rem; color: #666;">
          <strong>Address:</strong> ${location.address}<br />
          <strong>City:</strong> ${location.city}, ${location.state}
        </p>
      </div>
    `).join('');
  }
}

function getColorHex(color) {
  const colorMap = {
    'blue': '007bff',
    'red': 'dc3545',
    'green': '28a745',
    'orange': 'ffc107'
  };
  return colorMap[color] || '007bff';
}

function jumpToLocation(index) {
  if (!mapInstance || !markersArray[index]) return;
  
  const location = locations[index];
  mapInstance.setView(location.coordinates, 15, {
    animate: true,
    duration: 1
  });

  setTimeout(() => {
    markersArray[index].openPopup();
  }, 500);
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);

// People Data
const peopleData = [
  {
    id: 1,
    name: "General Anthony Wayne",
    role: "Revolutionary War Hero",
    history: "General Anthony Wayne was born near Exton and was a hero in the American Revolutionary War. Known for his bold and daring tactics, he earned the nickname 'Mad Anthony.' Wayne played a crucial role in several key battles, including the Battle of Stony Point and the Battle of Yorktown. After the war, he continued to serve his country as a statesman and military leader, contributing to the early development of the United States. He is rumored to still haunt the residents of Exton and nearby areas."
  },
  {
    id: 2,
    name: "Dr. William Darlington",
    role: "Botanist & Physician",
    history: "Dr. William Darlington was a renowned botanist, physician, and banker, born in nearby Birmingham Township (1782-1863)."
  },
  {
    id: 3,
    name: "Matt Ryan",
    role: "NFL Quarterback",
    history: "Matt Ryan, the former NFL quarterback for the Atlanta Falcons and Indianapolis Colts, was born in Exton, Pennsylvania. His leadership and skills on the field have made him one of the most decorated players in the league."
  },
  {
    id: 4,
    name: "Kerr Smith",
    role: "Actor",
    history: "Kerr Smith is an American actor known for his roles in popular movies like 'Final Destination' and TV shows such as 'Dawson's Creek' and 'Charmed'. He was born in Exton, Pennsylvania."
  },
  {
    id: 5,
    name: "Joseph Parker",
    role: "Historic Landowner",
    history: "Joseph Parker is a historic figure who owned land in Exton during the early to mid 18th century. He was known for his contributions to the local community and preserving key artifacts from that time period."
  }
];

// Initialize people section
function initPeople() {
  const peopleGrid = document.getElementById('people-grid');
  if (!peopleGrid) return;

  peopleGrid.innerHTML = peopleData.map((person) => `
    <div class="people-card">
      <h3 class="card-title" style="color: #fff; margin-bottom: 0.5rem;">${person.name}</h3>
      <span class="badge" style="background-color: rgba(255, 128, 119, 0.3); color: #ffb199; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; display: inline-block; margin-bottom: 1rem;">${person.role}</span>
      <p class="card-text" style="color: #e0e0e0; margin: 0;">${person.history}</p>
    </div>
  `).join('');
}

// Fun Facts Data
const funFacts = [
  {
    question: "What year was the Exton Hotel built?",
    answer: "1859 - It served as a stagecoach stop and railroad station"
  },
  {
    question: "Who was born near Exton?",
    answer: "General Anthony Wayne, a Revolutionary War hero nicknamed 'Mad Anthony'"
  },
  {
    question: "When did Exton Square Mall open?",
    answer: "1973 - Marking a significant development in the region's commercial landscape"
  },
  {
    question: "What famous actor was born in Exton?",
    answer: "Kerr Smith, known for Final Destination and Dawson's Creek"
  },
  {
    question: "What NFL quarterback is from Exton?",
    answer: "Matt Ryan, former Atlanta Falcons and Indianapolis Colts quarterback"
  },
  {
    question: "What happened to Exton Square Mall in 2025?",
    answer: "It was sold for $34.25 million for redevelopment into a mixed-use community with 600+ apartments and townhomes"
  }
];

// Initialize fun facts
function initFunFacts() {
  const container = document.getElementById('facts-container');
  if (!container) return;

  container.innerHTML = funFacts.map((fact, index) => `
    <div class="fact-card" onclick="toggleFact(this)">
      <div class="fact-front">${fact.question}</div>
      <div class="fact-back">${fact.answer}</div>
    </div>
  `).join('');
}

function toggleFact(element) {
  element.classList.toggle('flipped');
}

// Update the DOMContentLoaded to also initialize fun facts
document.addEventListener('DOMContentLoaded', function() {
  initMap();
  initPeople();
  initFunFacts();
});
