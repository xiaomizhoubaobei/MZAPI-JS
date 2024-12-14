import axios from 'axios';
import APM from './apm';

const ACCESS_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const ADDRESS_RECOGNITION_URL = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/address';

class NewFeature {
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.apm = new APM();
    }

    getAccessToken(parentSpan = null) {
        const span = this.apm.startSpan('getAccessToken', parentSpan);
        this.apm.addTags(span, { apiKey: this.apiKey, secretKey: this.secretKey });
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: `${ACCESS_TOKEN_URL}?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.secretKey}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            this.apm.addTag(span, 'url', options.url);

            axios(options)
                .then(response => {
                    const data = response.data;
                    if (data.access_token) {
                        this.apm.addTag(span, 'access_token', data.access_token);
                        this.apm.finishSpan(span);
                        resolve(data.access_token);
                    } else {
                        const err = new Error('Failed to obtain access token');
                        this.apm.finishSpan(span);
                        reject(err);
                    }
                })
                .catch(error => {
                    this.apm.finishSpan(span);
                    reject(error);
                });
        });
    }

    recognizeAddress(accessToken, text, parentSpan = null) {
        const span = this.apm.startSpan('recognizeAddress', parentSpan);
        this.apm.addTags(span, { text });
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
                    this.apm.addTag(span, 'recognized_address', response.data);
                    this.apm.finishSpan(span);
                    resolve(response.data);
                })
                .catch(error => {
                    this.apm.finishSpan(span);
                    reject(error);
                });
        });
    }
}

export default NewFeature;
