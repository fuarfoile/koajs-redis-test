const
    config = require('config'),
    redis = require("redis"),
    client = redis.createClient(config.redis.port),
    fakeDelay=200;

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on("error", function(error) {
    console.error(error);
});


module.exports = {
    /**
     * Get all records from memory DB
     * @return {Promise}
     */
    getAll: function getAllFromDb() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                client.smembers(`users`, function(err, reply) {
                    let keys = [];
                    reply.forEach(id => {
                        keys.push(`user:${ id }`);
                    });

                    client.mget(keys, function (err, reply) {
                        if (reply) {
                            resolve(reply.map(JSON.parse));
                        } else {
                            resolve([]);
                        }
                    });
                });
            }, fakeDelay);
        });
    },
    /**
     * Get record by id from memory DB
     * @param id
     * @return {Promise}
     */
    getById: function getIdFromDb(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                client.get(`user:${ id }`, function(err, reply) {
                    if (reply){
                        resolve(JSON.parse(reply));
                    } else {
                        resolve({});
                    }
                });
            }, fakeDelay);
        });
    },
    /**
     * Add new record to memory DB
     * @param name
     * @return {Promise}
     */
    setNewId: function setNewIdToDb(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                client.INCR('id:users', function(err, reply) {
                    let id = parseInt(reply) - 1;

                    client.set(`user:${ id }`, JSON.stringify({'id':id, 'name':name}), function(err, reply) {

                        client.sadd('users', id);

                        resolve(module.exports.getById(id));
                    });
                });
            }, fakeDelay);
        });
    },
    /**
     * Update record into memory DB
     * @param id
     * @param name
     * @return {Promise}
     */
    updateId: function updateIdToDb(id,name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                id = parseInt(id);

                client.set(`user:${ id }`, JSON.stringify({'id':id, 'name':name}), function(err, reply) {
                    client.sadd('users', id, function(err, reply) {
                        resolve(module.exports.getById(id));
                    });
                });
            }, fakeDelay);
        });
    },

    /**
     * Remove record from memory DB
     * @param id
     * @return {Promise}
     */
    removeId: function removeIdInDb(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                id = parseInt(id);

                client.get('id:users', function(err, reply) {
                    if (id + 1 === parseInt(reply)) {
                        client.DECR('id:users');
                    }
                });

                client.del(`user:${ id }`);
                client.srem('users', id);

                resolve();
            }, fakeDelay);
        });
    }
}