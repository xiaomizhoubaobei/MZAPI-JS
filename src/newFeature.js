const axios = require('axios');
const APM = require('./apm');

const ACCESS_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const ADDRESS_RECOGNITION_URL = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/address';

const apm = new APM();

function getAccessToken(apiKey, secretKey, parentSpan = null) {
    const span = apm.startSpan('getAccessToken', parentSpan);
    apm.addTags(span, { apiKey, secretKey });
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `${ACCESS_TOKEN_URL}?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        apm.addTag(span, 'url', options.url);

        axios(options)
            .then(response => {
                const data = response.data;
                if (data.access_token) {
                    apm.addTag(span, 'access_token', data.access_token);
                    apm.finishSpan(span);
                    resolve(data.access_token);
                } else {
                    const err = new Error('Failed to obtain access token');
                    apm.finishSpan(span);
                    reject(err);
                }
            })
            .catch(error => {
                apm.finishSpan(span);
                reject(error);
            });
    });
}

function recognizeAddress(accessToken, text, parentSpan = null) {
    const span = apm.startSpan('recognizeAddress', parentSpan);
    apm.addTags(span, { text });
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `${ADDRESS_RECOGNITION_URL}?access_token=${accessToken}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: { text }
        };

        axios(options)
            .then(response => {
                apm.addTag(span, 'recognized_address', response.data);
                apm.finishSpan(span);
                resolve(response.data);
            })
            .catch(error => {
                apm.finishSpan(span);
                reject(error);
            });
    });
}

module.exports = { getAccessToken, recognizeAddress }
