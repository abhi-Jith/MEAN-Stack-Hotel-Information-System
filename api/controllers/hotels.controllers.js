
var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if (isNaN(lng) || isNaN(lat)) {
        res
            .status(400)
            .json({
                "Message": "latitude and longitude should be numbers"
            });
        return;
    }
    //Geo Json POint
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };

   

    Hotel.aggregate(
        [
            {
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'dist',
                    'maxDistance': 2000,
                    'num' : 5
                }
            }
        ],
        function (err, results) {
            var response = {
                status: 200,
                message: results
            };
            if (err) {
                console.log("Error finding hotels");
                response.status = 500;
                response.message = err;
            }else if(!results){
                console.log("Error finding hotels");
                response.status = 404;
                response.message = {
                    "message": "Latitude and longitude didnt find any hotel in 2000 meters"
                };
            }
            console.log('Geo results', results);
            res 
                .status(response.status)
                .json(response.message);
        }
    );

};

module.exports.hotelsGetAll = function (req, res) {
    // var db = dbconn.get();
    // var collection = db.collection('hotels');

    /*
    *find method should be converted to asynchronous 
    *by passing a call back and data 
    *should be got in an array
    */
    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    }

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        res
            .status(400)
            .json({
                "Message": "Offset and count should be numbers"
            });
        return;
    }
    if (count > maxCount) {
        res
            .status(400)
            .json({
                "Message": "Count limit of " +maxCount +" exceeded"
            });
        return;
    }
    
    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){
            if (err) {
                console.log("Error finding hotels");
                res
                    .status(500)
                    .json(err);
            }
            else{
            console.log("Found hotels", hotels.length);
            res
                .json(hotels);
            }
        });
    // collection
    //     .find()
    //     .skip(offset)
    //     .limit(count)
    //     .toArray(function(err, docs) {
    //         console.log("Hotels Found", docs);
    //         res
    //             .status(200)
    //             .json(docs);
    // });
};  

module.exports.hotelsGetOne = function (req, res) {
    var hotelId = req.params.hotelId;
    console.log("Get the hotelID: " + hotelId);

    Hotel
        .findById(hotelId)
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err) {
                console.log("Error finding hotels");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message":"HotelId not found"
                };
            }
            res
                .status(response.status)
                .json(response.message);
          
        });     
};  

module.exports.hotelsAddOne = function (req, res) {
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;

    console.log("Post the new hotel");

    //error checking on posting data
    if (req.body && req.body.name && req.body.stars) {

        newHotel = req.body;
        newHotel.stars= parseInt(req.body.stars,10);

        collection.insertOne(newHotel, function (err, response) {
            console.log(response);
            console.log(response.ops);
            res
                .status(201)
                .json(response.ops);
        });
        
    }
    else{
        console.log("data missing from body");
        res 
            .status(400)
            .json({"message" : "Required data misisng from body"});
    }
    
};

module.exports.hotelsAddMulti = function (req, res) {
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;

    console.log("Post the new hotel");

    //error checking on posting data
    if (req.body && req.body.name && req.body.stars) {

        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);

        collection.insert(newHotel, function (err, response) {
            console.log(response);
            console.log(response.ops);
            res
                .status(201)
                .json(response.ops);
        });

    }
    else {
        console.log("data missing from body");
        res
            .status(400)
            .json({ "message": "Required data misisng from body" });
    }

};