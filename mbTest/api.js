'use strict';

const httpClient = require('./baseHttpClient').create('http'),
    assert = require('assert'),
    fs = require('fs-extra');

function create (port) {
    port = port || parseInt(process.env.MB_PORT || 2525);

    function get (path) {
        return httpClient.get(path, port);
    }

    function post (path, body) {
        return httpClient.post(path, body, port);
    }

    function del (path) {
        return httpClient.del(path, port);
    }

    function put (path, body) {
        return httpClient.put(path, body, port);
    }

    async function createImposter (imposter) {
        const response = await post('/imposters', imposter);
        assert.strictEqual(response.statusCode, 201, JSON.stringify(response.body, null, 2));
        return response;
    }

    async function isOutOfProcessImposter (protocol) {
        const response = await get('/config');
        const protofile = `${response.body.process.cwd}/${response.body.options.protofile}`;
        if (fs.existsSync(protofile)) {
            const protocols = JSON.parse(fs.readFileSync(protofile));
            return Object.keys(protocols).indexOf(protocol) >= 0;
        }
        else {
            return false;
        }
    }

    return {
        url: `http://localhost:${port}`,
        port,
        get, post, del, put,
        createImposter,
        isOutOfProcessImposter
    };
}

module.exports = { create };
