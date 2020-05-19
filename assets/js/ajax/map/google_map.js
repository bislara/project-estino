      // In this, we center the map, and add a marker, using a LatLng object
      // literal instead of a google.maps.LatLng object. LatLng object literals are
      // a convenient way to add a LatLng coordinate and, in most cases, can be used
      // in place of a google.maps.LatLng object.
      console.log(lat,lon);
      var map;



      // ///////////////////////////////////////////////////////////// 
      // main function for plotting in map
      // ////////////////////////////////////////////////////////////
      function initialize() {
        
        // initialize the map with a particular zoom ratio and its center
        var mapOptions = {
          zoom: 12,
          center: {lat: parseFloat(lat[0]), lng: parseFloat(lon[0])}
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);


      // ///////////////////////////////////////////////////////////// 
      // plotting for user's cycles in map
      // ////////////////////////////////////////////////////////////
        var user_marker = [];

        for (var i = lat.length - 1; i >= 0; i--) {
          
          user_marker[i] = new google.maps.Marker({
          // The below line is equivalent to writing:
          // position: new google.maps.LatLng(-34.397, 150.644)
              position: {lat: parseFloat(lat[i]), lng: parseFloat(lon[i])},
              map: map
          });
          user_marker[i].setMap(map);  

          var infowindow = new google.maps.InfoWindow();  
              google.maps.event.addListener(user_marker[i], 'click', (function(marker,i) {  
                 return function() {  
                   var content = '<p style= "color:black;">Marker Location:' + marker.getPosition() + '</p>';  
                                   infowindow.setContent(content);  
                                   infowindow.open(map, marker);  
                    }  ;
              })(user_marker[i],i));   

        }

        

        
      // ///////////////////////////////////////////////////////////// 
      // plotting nearby cycles with rent mode ON in map
      // ////////////////////////////////////////////////////////////
        var difference = 0.09;
        var coordinate_data = "id="+ id + "&min_lat="+(parseFloat(lat) - difference) + "&max_lat=" + (parseFloat(lat)+difference) + "&min_lon=" + (parseFloat(lon) - difference) + "&max_lon="+(parseFloat(lon) + difference);  

        
          $.ajax({
              url: '../apis/user/map_data/nearby_cycles.php',        
              type: 'POST',
              data : coordinate_data,
              success:(response)=>{
              response=JSON.parse(response);
              // console.log(response);
              // console.log(response.result.length);

            // add a markers reference
              map.markers = [];
              var marker = new Array(response.result.length);
              
              for (var i = response.result.length - 1; i >= 0; i--) {
            
                var latlng = new google.maps.LatLng(parseFloat(response.result[i].gps_details[1][0]),parseFloat(response.result[i].gps_details[1][1]) );
    
                // create marker
                marker[i] = new google.maps.Marker({
                    position    : latlng,
                    map         : map,
                });
             
                // add to array
                // map.markers.push( marker );
                  marker[i].setMap(map);
                 
                // if marker contains HTML, add it to an infoWindow
                // create info window
              
                   var infowindow = new google.maps.InfoWindow();  
                    google.maps.event.addListener(marker[i], 'click', (function(marker,i) {  
                               return function() {  
                                   var content = '<p style= "color:black;">Marker Location:' + marker.getPosition() + '</p>';  
                                   infowindow.setContent(content);  
                                   infowindow.open(map, marker);  
                               }  ;
                             })(marker[i],i));  

                }
              }
          }); 

      }
      
      // call the initialize function
      google.maps.event.addDomListener(window, 'load', initialize);
      $(document).ready( function () {
              initialize();
          });
