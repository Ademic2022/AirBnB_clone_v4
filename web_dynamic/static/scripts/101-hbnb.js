$(document).ready(function () {
  let checkedAmenities = {};
  let checkedStates = {};
  let checkedCities = {};
  let checkedLocations = {};
  /* filter amenities */
  $(document).on('change', "input[type='checkbox']", function () {
    if (this.checked) {
      checkedAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedAmenities[$(this).data('id')];
    }
    let lst = Object.values(checkedAmenities);
    if (lst.length > 0) {
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });
  /* filter states */
  $(document).on('change', ".locations > .popover > li > input[type='checkbox']", function () {
    if (this.checked) {
      checkedStates[$(this).data('id')] = $(this).data('name');
      checkedLocations[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedStates[$(this).data('id')];
      delete checkedLocations[$(this).data('id')];
    }
    let lst = Object.values(checkedLocations);
    if (lst.length > 0) {
      $('div.locations > h4').text(lst.join(', '));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });
  /* filter cities */
  $(document).on('change', ".locations > .popover > li > ul > li > input[type='checkbox']", function () {
    if (this.checked) {
      checkedCities[$(this).data('id')] = $(this).data('name');
      checkedLocations[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedCities[$(this).data('id')];
      delete checkedLocations[$(this).data('id')];
    }
    let lst = Object.values(checkedLocations);
    if (lst.length > 0) {
      $('div.locations > h4').text(lst.join(', '));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });
  /* checking api status */
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });
  /* render places from the front-end */
  getPlaces()

  /* review show/hide feature */
    .then(function () {
      $('.rev_toggle').each(function () {
        $(this).click(function (e) {
          e.stopPropagation();
          if (e.target.innerText === 'show') {
            getReviews(e.target.getAttribute('place-id'))
              .then(reviews => {
                Array.prototype.forEach.call(reviews, review => {
                  $(this).parent().find('.reviews_list').append(`<li>
                <h3>${review.from}</h3>
                <p>${review.text}</p>
              </li>`);
                });
                e.target.innerText = 'hide';
              });
          } else {
            e.target.innerText = 'show';
            $(this).parent().find('.reviews_list').html('');
          }
        });
      });
    }).catch(err => console.log(err));

  /* render places after clicking the button */
  $('.filters button').click(function () {
    getPlaces({
      amenities: Object.values(checkedAmenities),
      cities: Object.values(checkedCities),
      states: Object.values(checkedStates)
    });
  });
});

/* defining the getPlaces() function */
function getPlaces (data = {}) {
  /* render places */
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data, status) {
      if (status === 'success') {
        data.forEach((place) => $('section.places').append(`<article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guests</div>
                <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
        </div>
        <div class="user">
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article>`));
      }
    }
  });
}
