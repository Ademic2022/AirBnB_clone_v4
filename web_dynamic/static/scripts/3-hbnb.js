$('document').ready(function () {
    let amenities = {};
    $('input[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        amenities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete amenities[$(this).attr('data-id')];
      }
      $('.amenities h4').text(Object.values(amenities).join(', '));
    });
    
    // Function to update the API status
    function updateApiStatus() {
        $.get("http://0.0.0.0:5001/api/v1/status/", function(data) {
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
    setInterval(updateApiStatus, 5000);
});
