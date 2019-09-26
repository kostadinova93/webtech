
var express = require('express');
var app = express();
var mysql = require('mysql');
var sort = require('fast-sort');
var https = require('https');
// Create database connection
var db = mysql.createPool({
    host: 'database-2.cjacekjmeun5.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'XXXXXX',
    database: 'giftideagenerator',
    multipleStatements: true
});

function LoadIdeas(callback) {
    var ideas = [], tags = [], shops = [];

    var sql = "SELECT * FROM idea;"
    sql += "SELECT * FROM tag;"
    sql += "SELECT * FROM idea_tags;"
    sql += "SELECT * FROM voting;"
    sql += "SELECT * FROM voting_tags;"
    sql += "SELECT * FROM category;"
    sql += "SELECT * FROM shop;"
    sql += "SELECT * FROM shop_ideas;"
    db.query(sql, function (error, results, fields) {
        if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }
        var idea = results[0];
        tags = results[1];
        var idea_tags = results[2];
        var voting = results[3];
        var voting_tags = results[4];
        var category = results[5];
        shops = results[6];
        var shop_ideas = results[7];

        shops.forEach(x => {
            x.ideasIds = shop_ideas.filter(y => y.shop == x.id).map(y => y.idea);
        })
        // Merge tag and category
        tags.forEach(x => {
            x.category = category.find(y => y.id == x.category).name;
        });

        // Assign values to idea
        idea.forEach(x => {
            x.tags = idea_tags.filter(y => y.idea == x.id);
            x.tags = x.tags.map(y => tags.find(z => z.id == y.tag));

            x.likes = 0;
            x.votings = voting.filter(y => y.idea == x.id);
            x.votings.forEach(y => {

                y.tags = tags.filter(z => voting_tags.find(a => a.tag == z.id && a.voting == y.id) != null);
                x.likes += y.like;
            });


            x.shops = shop_ideas.filter(y => y.idea == x.id);
            var ideashops = [];
            x.shops.forEach(y => {
                var tmpshop = shops.find(z => z.id == y.shop);
                ideashops.push({
                    id: tmpshop.id, onlineOnly: (tmpshop.lat == null || tmpshop.lat == 0), name: tmpshop.name,
                    link: tmpshop.link, lat: tmpshop.lat, lon: tmpshop.lon, address: tmpshop.address,
                    ideaPrice: y.price != null ? y.price : x.price,
                    ideaPriceNice: y.price != null ? MakePriceNice(y.price) : MakePriceNice(x.price), ideaLink: y.link != null ? y.link : tmpshop.link
                });
            });
            x.shops = ideashops;

            x.priceNice = MakePriceNice(x.price);
            x.rating = 0;

        });


        idea = sort(idea).desc(u => u.rating);

        ideas = idea;
        app.ideas = idea;

        return callback(ideas, tags, shops);

    });
}
function MakePriceNice(price) {
    return (price.toFixed(2)).replace(".", ",");
}

app.listen(3001, function () {
    console.log('App listening on port 3001!');
});

app.get('/api/test', (req, res) => {

    if (res != null) {
        res.send(mmmn);
        mmmn = "5";

    }
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/loadfilter', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {
        var sql = "SELECT * FROM category;"
        sql += "SELECT * FROM tag;"
        db.query(sql, function (error, results, fields) {
            if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }
            var categories = results[0];
            categories.forEach(x => {
                x.tags = results[1].filter(y => y.category == x.id);
            });

            res.send(JSON.stringify(categories));
        });
    });
});

app.get('/api/loadshops', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {
        var sql = "SELECT * FROM shop;"
        db.query(sql, function (error, results, fields) {
            if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

            res.send(JSON.stringify(results));
        });
    });

});

app.get('/api/getshop', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        var shopName = req.query.name;
        var foundShop = shops.find(x => x.name == shopName);
        if (foundShop == null) {
            res.send("No shop found");
        } else {
            res.send(JSON.stringify(foundShop));
        }
    });

});

app.get('/api/loadideas', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {
        res.send(JSON.stringify(ideas));
    });

});

app.get('/api/getideas', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        var filterQuery = req.query.filter;
        var filter = [];
        if (filterQuery != null && filterQuery.length > 4) {
            filter = JSON.parse(filterQuery);
        }
        var userlocation = null;
        if (req.query.lat != null && req.query.lon != null) {
            userlocation = { lat: req.query.lat, lon: req.query.lon };
        }

        var whitelist = null;
        if (req.query.whitelist != null) {
            whitelist = JSON.parse(req.query.whitelist);
        }

        var blacklist = null;
        if (req.query.blacklist != null) {
            blacklist = JSON.parse(req.query.blacklist);
        }

        // Rate 
        var myideas = [];
        ideas.forEach(x => {
            if ((whitelist != null && whitelist.includes(x.id) == false)
                || (blacklist != null && blacklist.includes(x.id) == true)) {
                return;
            }


            // Filter
            x.rating = 0;
            var distanceMaximum = -1;
            for (var f = 0; f < filter.length; f++) {
                if (x.tags.find(y => y.name.toLowerCase() == filter[f].toLowerCase()) != null) {
                    x.rating += 1;
                }

                // text search
                if (x.name.toLowerCase().includes(filter[f].toLowerCase())) x.rating += .08;
                if (x.description != null && x.description.toLowerCase().includes(filter[f].toLowerCase())) x.rating += .04;
                if (x.link != null && x.link.toLowerCase().includes(filter[f].toLowerCase())) x.rating += .02;

                x.shops.forEach(y => {
                    if (y.name.toLowerCase().includes(filter[f].toLowerCase())) x.rating += 0.015;
                    if (y.link.toLowerCase().includes(filter[f].toLowerCase())) x.rating += 0.01;
                });

                if (filter[f].includes("Distance:")) {
                    distanceMaximum = parseFloat(filter[f].split(":")[1]);
                }
                if (filter[f].includes("SingleEntry:")) {
                    var singleEntry = parseInt(filter[f].split(":")[1]);
                    if (x.id == singleEntry) x.rating += 222;
                }



            }


            // Distance
            if (x.lat != null && userlocation != null) {
                x.distance = distance(x.lat, x.lon, userlocation.lat, userlocation.lon);

            }

            // Shops
            if (userlocation != null) {
                x.shops.forEach(y => y.distance = y.lat == null ? 100 : distance(y.lat, y.lon, userlocation.lat, userlocation.lon));
                x.shops = sort(x.shops).asc(u => (u.ideaPrice / 10) + u.distance);
                x.shops.forEach(y => y.distance = y.lat == null ? null : y.distance);

            } else {
                x.shops.forEach(y => y.distance = null);
                x.shops = sort(x.shops).asc(u => u.ideaPrice + (u.onlineOnly ? 0 : 10000));
            }
            if (x.shops.length > 0) {
                x.nearestShop = x.shops[0];
            } else {
                x.nearestShop = null;
            }

            // Distance filter
            if (userlocation != null && distanceMaximum > 0) {
                if (x.distance != null) {
                    if (x.distance > distanceMaximum) x.rating = 0; else x.rating += .1;
                }
                if (x.nearestShop != null && x.nearestShop.distance != null) {
                    if (x.nearestShop.distance > distanceMaximum) x.rating = 0; else x.rating += .1;
                }

            }


            if (x.rating <= 0 && whitelist == null) return;

            x.rating += x.likes / 5000.0;

            myideas.push(x);
        });


        myideas = sort(myideas).desc(u => u.rating);
        if (myideas.length > 50) myideas = myideas.slice(0, 50);
        res.send(JSON.stringify(myideas));
    });

});

app.get('/api/addidea', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        SecurityCheck(req, res, function () {
            var name = (req.query.name);
            var description = (req.query.description);
            var price = (req.query.price);
            var link = (req.query.link);
            var image = (req.query.image);
            var lat = (req.query.lat);
            var lon = (req.query.lon);
            var address = (req.query.address);


            if (name == null || price == null) {
                res.send("error");
                return;
            }

            db.query('INSERT INTO idea(name, description, price, link, image, lat, lon, address) VALUES(?,?,?,?,?,?,?,?);',
                [name, description, price, link != "" ? link : null, image, lat != "" ? lat : null, lon != "" ? lon : null, address != "" ? address : null],
                function (error, results, fields) {
                    if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                    if (req.query.tags != null) {
                        InsertTags(JSON.parse(req.query.tags), "idea_tags", "idea", results.insertId, res, function () {

                        });
                    }

                    if (req.query.shops != null) {
                        InsertShops(JSON.parse(req.query.shops), results.insertId, res, function () {

                        });
                    }

                    setTimeout(function () {
                        res.send("success");
                        LoadIdeas();
                    }, 300);

                });
        });
    });
});

app.get('/api/addshop', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        SecurityCheck(req, res, function () {
            var name = (req.query.name);
            var description = (req.query.description);
            var pricelvl = (req.query.pricelvl) == null || req.query.pricelvl == "" ? "0" : req.query.pricelvl;
            var link = (req.query.link);
            var image = (req.query.image);
            var lat = (req.query.lat);
            var lon = (req.query.lon);
            var address = (req.query.address);

            if (name == null) {
                res.send("error");
                return;
            }

            db.query('INSERT INTO shop(name, description, pricelvl, link, image, lat, lon, address) VALUES(?,?,?,?,?,?,?,?);',
                [name, description, pricelvl, link != "" ? link : null, image, lat != "" ? lat : null, lon != "" ? lon : null, address != "" ? address : null],
                function (error, results, fields) {
                    if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                    res.send("success");
                    LoadIdeas();
                });
        });
    });
});

app.get('/api/updateshop', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        SecurityCheck(req, res, function () {
            var shopid = (req.query.id);
            var name = (req.query.name);
            var description = (req.query.description);
            if (description == null || description.length < 3) description = null;
            var pricelvl = (req.query.pricelvl);
            var link = (req.query.link);
            var image = (req.query.image);
            var lat = (req.query.lat);
            var lon = (req.query.lon);
            var address = (req.query.address);

            db.query('UPDATE shop SET name =?,  description=?, pricelvl=?, link=?, lat=?, lon=?, address=?, image=? WHERE id=?; ',
                [name, description, pricelvl != "" ? pricelvl : null, link, lat != "" ? lat : null, lon != "" ? lon : null, address != "" ? address : null, image, shopid],
                function (error, results, fields) {
                    if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                    res.send("success");
                    LoadIdeas();
                });
        });
    });

});

app.get('/api/updateidea', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        SecurityCheck(req, res, function () {
            var ideaid = (req.query.id);
            var name = (req.query.name);
            var description = (req.query.description);
            if (description == null || description.length < 3) description = "NULL";
            var price = (req.query.price);
            var link = (req.query.link);
            var image = (req.query.image);
            var lat = (req.query.lat);
            var lon = (req.query.lon);
            var address = (req.query.address);

            db.query('UPDATE idea SET name =?,  description=?, price=?, link=?, image=?, lat=?, lon=?, address=? WHERE id=?; DELETE FROM idea_tags WHERE idea=?; DELETE FROM shop_ideas WHERE idea=?;',
                [name, description, price, link != "" ? link : null, image, lat != "" ? lat : null, lon != "" ? lon : null, address != "" ? address : null, ideaid, ideaid, ideaid],
                function (error, results, fields) {
                    if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                    if (req.query.tags != null && req.query.tags.length > 3) {
                        InsertTags(JSON.parse(req.query.tags), "idea_tags", "idea", ideaid, res, function () {

                        });
                    }

                    if (req.query.shops != null) {
                        InsertShops(JSON.parse(req.query.shops), ideaid, res, function () {

                        });
                    }

                    setTimeout(function () {
                        res.send("success");
                        LoadIdeas();
                    }, 300);


                });
        });
    });

});
app.get('/api/deleteshop', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        SecurityCheck(req, res, function () {
            var shopid = (req.query.id);

            db.query('DELETE FROM shop_ideas WHERE shop=?; DELETE FROM shop WHERE id=?;',
                [shopid, shopid, shopid, shopid, shopid],
                function (error, results, fields) {
                    if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                    res.send("success");
                    LoadIdeas();
                });
        });
    });

});

app.get('/api/deleteidea', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        SecurityCheck(req, res, function () {
            var ideaid = (req.query.id);

            db.query('DELETE FROM voting_tags WHERE voting IN (SELECT id FROM voting WHERE idea=?); DELETE FROM voting WHERE idea=?; DELETE FROM shop_ideas WHERE idea=?; DELETE FROM idea_tags WHERE idea=?; DELETE FROM idea WHERE id=?;',
                [ideaid, ideaid, ideaid, ideaid, ideaid],
                function (error, results, fields) {
                    if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                    res.send("success");
                    LoadIdeas();
                });
        });
    });

});

app.get('/api/addvote', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        db.query('INSERT INTO voting(idea, voting.like) VALUES(?,?);',
            [req.query.id, req.query.like],
            function (error, results, fields) {
                if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                if (req.query.tags != null) {
                    InsertTags(JSON.parse(req.query.tags), "voting_tags", "voting", results.insertId, res, function () {
                        res.send("success");
                        LoadIdeas();
                    });
                } else {
                    res.send("success");
                    LoadIdeas();
                }

            });
    });

});


app.get('/api/adduser', (req, res) => {
    LoadIdeas((ideas, tags, shops) => {

        if (req.query.invitecode != "123") {
            res.send("Error: Wrong invite code");
            return;
        }

        db.query('INSERT INTO user(name, password, mail) VALUES(?,?,?);',
            [req.query.name, HashString(req.query.password), req.query.mail],
            function (error, results, fields) {
                if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }

                res.send("success");
            });
    });

});



app.get('/api/login', (req, res) => {
    SecurityCheck(req, res, function () {
        res.send("success");
    });
});


app.get('/api/getcoordinates', (req, res) => {
    var key = "XXXXXX";
    var address = req.query.address;
    if (address.length < 4 || address.length > 50) {
        res.send("error");
        return;
    }
    var options = {
        host: 'maps.googleapis.com',
        path: '/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + key
    };

    var httpreq = https.get(options, function (httpresponse) {

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        httpresponse.on('data', function (chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            if (body.length < 60) {
                res.send("error");
            } else {
                var json = JSON.parse(body);
                if (json.results.length == 0) {
                    res.send("error");
                } else {
                    var latlon = json.results[0].geometry.location;
                    var name = json.results[0].formatted_address;
                    res.send(JSON.stringify({ name: name, lat: latlon.lat, lon: latlon.lng }));
                }
            }
        })
    });
});

function InsertShops(newShops, ideaId, res, callback) {
    var sql = "DELETE FROM shop_ideas WHERE idea=" + ideaId + ";";
    newShops.forEach(x => {
        var curShop = shops.find(y => y.name == x.name);
        sql += "INSERT INTO shop_ideas (idea, shop, price, link) VALUES (" + ideaId + "," + curShop.id + "," +
            (x.price == null || x.price == "" ? "NULL" : x.price) + "," + (x.link == null || x.link == "" ? "NULL" : "'" + x.link + "'") + ");";
    });

    db.query(sql, function (error, results, fields) {
        if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }
        callback();
    });
}

function InsertTags(tagNameList, table, staticName, staticValue, res, callback) {
    var tagIDs = tagNameList.map(x => tags.find(y => y.name.toLowerCase() == x.toLowerCase()) != null ? tags.find(y => y.name.toLowerCase() == x.toLowerCase()).id : -1);
    tagIDs = tagIDs.filter(x => x != -1);
    if (tagIDs.length == 0) {
        callback();
        return;
    }
    var sql = "";
    tagIDs.forEach(x => {
        sql += "INSERT INTO " + table + " (" + staticName + ", tag) VALUES(" + staticValue + ", " + x + ");";
    });

    db.query(sql, function (error, results, fields) {
        if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }


        callback();
    });

}
function HashString(str) {
    return require('crypto').createHash('md5').update(str).digest("hex");
}
function SecurityCheck(req, res, callback) {
    db.query('SELECT * FROM user WHERE name = ? AND password = ?', [req.query.username, HashString(req.query.userpassword)], function (error, results, fields) {
        if (error) { console.log("ERROR: " + error.toString()); res.send("error"); return; }
        if (results == null || results.length == 0) {
            res.send("no permission");
            return;
        }

        callback();
    });
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
