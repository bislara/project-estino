      // In this example, we center the map, and add a marker, using a LatLng object
      // literal instead of a google.maps.LatLng object. LatLng object literals are
      // a convenient way to add a LatLng coordinate and, in most cases, can be used
      // in place of a google.maps.LatLng object.
      console.log(lat,lon)
      var map;

      function initialize() {
        var mapOptions = {
          zoom: 12,
          center: {lat: parseFloat(lat), lng: parseFloat(lon)}
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

        var user_marker = new google.maps.Marker({
          // The below line is equivalent to writing:
          // position: new google.maps.LatLng(-34.397, 150.644)
          position: {lat: parseFloat(lat), lng: parseFloat(lon)},
          map: map
        });

        
        var difference = 0.09;
        var coordinate_data = "id="+ id + "&min_lat="+(parseFloat(lat) - difference) + "&max_lat=" + (parseFloat(lat)+difference) + "&min_lon=" + (parseFloat(lon) - difference) + "&max_lon="+(parseFloat(lon) + difference);  

        // var infowindow = [];
        // var marker = [];

          $.ajax({
              url: '../apis/user/map_data/nearby_cycles.php',        
              type: 'POST',
              data : coordinate_data,
              success:(response)=>{
              response=JSON.parse(response);
              console.log(response);
              console.log(response.result.length);

            // add a markers reference
              map.markers = [];
              var marker = new Array(response.result.length);
              
              for (var i = response.result.length - 1; i >= 0; i--) {
            
                var latlng = new google.maps.LatLng(parseFloat(response.result[i]["gps_details"][1][0]),parseFloat(response.result[i]["gps_details"][1][1]) );
    
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
                
                   //  google.maps.event.addListener(marker[i], 'mouseover', () => {
                   //    console.log("Inside hover function");

                   //      infowindow.open(map, marker[i])
                   //  });

                   var infowindow = new google.maps.InfoWindow();  
                    google.maps.event.addListener(marker[i], 'click', (function(marker,i) {  
                               return function() {  
                                   var content = '<p style= "color:black;">Marker Location:' + marker.getPosition() + '</p>';  
                                   infowindow.setContent(content);  
                                   infowindow.open(map, marker);  
                               }  
                             })(marker[i],i));  

                    // google.maps.event.addListener(marker[i], 'mouseout', () => {
                    //     infowindow.close(map, marker[i])
                    // });


                    // show info window when marker is clicked
                    // google.maps.event.addListener(marker, 'click', function() {          
                    //     infowindow.open( map, marker );
                    // });
              }

            

              }
          });

        // You can use a LatLng literal in place of a google.maps.LatLng object when
        // creating the Marker object. Once the Marker object is instantiated, its
        // position will be available as a google.maps.LatLng object. In this case,
        // we retrieve the marker's position using the
        // google.maps.LatLng.getPosition() method.
        var user_infowindow = new google.maps.InfoWindow({
          content: '<p style= "color:black;">Marker Location:' + user_marker.getPosition() + '</p>'
        });

        google.maps.event.addListener(user_marker, 'click', function() {
          user_infowindow.open(map, user_marker);
        });
      }

      google.maps.event.addDomListener(window, 'load', initialize);

      // (20.344627, 85.909836) (20.324024, 85.843874)
       // For a 10 km query, you would use a margin of 10 / 111 = 0.09009 degrees of latitude or longitude.

       // var markerCount = 0; var map; //Initializes the map… 
       // function initialize() 
       // {
       //  var myLatlng = new google.maps.LatLng(46.855141, -96.8372664);
       //   var map_canvas = document.getElementById('map_canvas'); 
       //   var map_options = { center: myLatlng, zoom: 5, mapTypeId: google.maps.MapTypeId.ROADMAP }
       //    map = new google.maps.Map(map_canvas, map_options); 
       //    } //When the window is loaded, run the initialize function to //setup the map 
       //  google.maps.event.addDomListener(window, 'load', initialize);
       //   //This function will add a marker to the map each time it //is called. It takes latitude, longitude, and html markup //for the content you want to appear in the info window //for the marker. 
       //  function addMarkerToMap(lat, long, htmlMarkupForInfoWindow)
       //  {
       //   var infowindow = new google.maps.InfoWindow();
       //    var myLatLng = new google.maps.LatLng(lat, long);
       //     var marker = new google.maps.Marker({
       //      position: myLatLng,
       //      map: map, 
       //      animation: google.maps.Animation.DROP, }); //Gives each marker an Id for the on click markerCount++; //Creates the event listener for clicking the marker //and places the marker on the map 
       //     google.maps.event.addListener(marker, 'click', (function(marker, markerCount) 
       //     {
       //      return function() 
       //      {
       //       infowindow.setContent(htmlMarkupForInfoWindow); infowindow.open(map, marker); 
       //      } 
       //      })
       //      (marker, markerCount)); //Pans map to the new location of the marker map.panTo(myLatLng) } 
