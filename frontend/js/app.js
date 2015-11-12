(function() {
    var riders,
        selectedRider,
        vizlayers;
    var riderTableName = "tracks";
    var nameField = "rider_full_name";

    var fetchRider = function () {
      var sql = "SELECT distinct " + nameField + " from " + riderTableName;
      return $.get("https://bartaelterman.cartodb.com/api/v2/sql?q=" + sql);
    };

    var createRiderSelection = function () {
        $("#select-rider").append('<option value="0">All riders</option>');
        $("#select-rider").append('<option disabled>──────────</option>');
        for (var i=0; i<riders.length; i++) {
            var ridername = riders[i][nameField];
            var option = '<option value="' + (i+1) + '">' + ridername + '</option>';
            $("#select-rider").append(option);
        };
    };

    var selectRider = function() {
        var riderID = $("option:selected", this).val();
        if (riderID==0) {
            clearSelection();
        } else {
            selectedRider = riders[riderID-1];
            //console.log("selected: " + selectedRider);
            loadRider();
        }
    };

    var clearSelection = function() {
        vizlayers[1].getSubLayer(1).set({"sql": "SELECT * FROM " + riderTableName});
        vizlayers[1].getSubLayer(2).set(
            {
                "sql": "SELECT ST_MakeLine (the_geom_webmercator ORDER BY date_time ASC) AS the_geom_webmercator, " + nameField + " FROM " + riderTableName + " GROUP BY " + nameField
            });
    };

    var loadRider = function() {
        vizlayers[1].getSubLayer(1).set({"sql": "SELECT * FROM " + riderTableName + " WHERE " + nameField + "='" + selectedRider[nameField] + "'"});
        vizlayers[1].getSubLayer(2).set(
            {"sql": "SELECT ST_MakeLine (the_geom_webmercator ORDER BY date_time ASC) AS the_geom_webmercator, " + nameField + " FROM " +
        riderTableName + " WHERE " + nameField + "='" + selectedRider[nameField] + "' GROUP BY " + nameField
        });
    };


    window.onload = function() {
        fetchRider()
            .done(function (data) {
                riders = _.sortBy(data.rows, function(x) {return x[nameField];});
                createRiderSelection();
                $("#select-rider").on("change", selectRider);
            });
        var map = cartodb.createVis('map-canvas', 'https://bartaelterman.cartodb.com/api/v2/viz/2a23018e-87eb-11e5-98de-0ea31932ec1d/viz.json')
            .done(function(vis, layers) {
                vizlayers = layers;
            })
            .error(function(err) {
                console.log(err);
            });
    }
})();
