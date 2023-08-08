$('document').ready(function () {
  // const api = 'http://' + window.location.hostname;
  function updateApiStatus() {
    $.get("http://0.0.0.0:5002/api/v1/status/", function(data) {
      if (data.status === "OK") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    });
  }
  // Initial update
  updateApiStatus();
  // Refresh status every 5 seconds
  // setInterval(updateApiStatus, 5000);

  $.ajax({
    url: 'http://0.0.0.0:5002/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: getPlacesData,
    error: function (error) {
      console.error('Error fetching places data:', error);
      // Display error message in the article section
      displayErrorMessage('Error fetching places data. Please try again later or check your API connection.');
    }
  });

  let states = {};
  $('.locations > ul > li > input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
      // console.log("checked")
    } else {
      delete states[$(this).attr('data-id')];
      // console.log("checked")
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').eq(0).text(Object.values(locations).join(', '));
      // console.log(Object.values(locations))
    }
  });

  let cities = {};
  $('.locations input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
      // console.log("clicked")
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').eq(0).text(Object.values(locations).join(', '));
      // console.log(Object.values(locations))
    }
  });

  let amenities = {};
  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else {
      $('.amenities h4').text(Object.values(amenities).join(', '));
    }
  });
  // console.log([amenities, cities, states])
  $('button').click(function () {
    $.ajax({
      url: 'http://0.0.0.0:5002/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
        'states': Object.keys(states),
        'cities': Object.keys(cities),
        'amenities': Object.keys(amenities)
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: getPlacesData,
    });
  });
});

//  DISPLAY ERROR MESSAGES
function displayErrorMessage(message) {
  const errorMessageElement = $('#error-message');
  errorMessageElement.text(message);
}
// console.log([states, cities, amenities])
// Function to create articles based on places data
function getPlacesData(data) {
  const placessection = $('section.places');
  const articles = data.map(place => {
    return `
      <article>
        <div class="headline">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">
            <div class="guest_icon"></div>
            <p>${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</p>
          </div>
          <div class="number_rooms">
            <div class="bed_icon"></div>
            <p>${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</p>
          </div>
          <div class="number_bathrooms">
            <div class="bath_icon"></div>
            <p>${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article>
    `;
  });

  placessection.empty(); // Clear any existing content
  placessection.append(articles.join('')); // Add the new articles to the DOM
}