// All redis code goes here
module.exports = function(app, config){
    var url = require('url');
    var redisURL = url.parse(process.env.REDISCLOUD_URL);
    var redis = require("redis").createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    if(redisURL.auth !== null) {
        redis.auth(redisURL.auth.split(":")[1]);
    }
    redis.on("connect", function () {
        console.log("DB RUNNING");
    });
    redis.on("error", function (err) {
        console.log("Error "+ err);
    });

    var db = {
        port : redisURL.port,
        hostname: redisURL.hostname,
        roomKey: function(id) {
            return "room:" + id;
        },
        
        roomPasswordKey: function(id) {
            return "room:" + id + ":password";
        },

        userListKey: function(id) {
            return "Users:" + id;
        },

        setUserListKey: function(id, value) {
            redis.lpush(this.userListKey(id), value, function(err) {
                if(err) throw err;
            });
        },

        setRoomKey: function(id, value) {
            redis.set(this.roomKey(id), value, function(err) {
                if(err) throw err;
            });
        },

        setRoomPasswordKey: function(id, value) {
            redis.set(this.roomPasswordKey(id), value, function(err) {
                if(err) throw err;
            });
        },

        getRoomKey: function(id, callback) {
            redis.get(this.roomKey(id), callback);
        },

        getRoomPasswordKey: function(id, callback) {
            redis.get(this.roomPasswordKey(id), callback);
        }, 

        getUserListKey: function(id, callback) {
            redis.lrange(this.userListKey(id), 0, -1, callback);
        }, 

        delUserListKey: function(id, value, callback) {
            redis.lrem(this.userListKey(id), 1, value, function(err) {
                if(err) throw err;
            });
        }, 

        getClient: function() {
            return redis;
        }
    }

    return db;
};

