const axios = require('axios');
const APM = require('./apm.js');
const KmsEncryption = require('./kms.js');

const ACCESS_TOKEN_URL = 'https://aip.baidubce.com/oauth/2.0/token';
const ADDRESS_RECOGNITION_URL = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/address';

/**
 * NewFeature 类用于处理与百度AI开放平台的交互，包括获取访问令牌和地址识别功能。
 */
class NewFeature {
    /**
     * 构造函数
     * @param {string} apiKey - 百度AI开放平台的API Key
     * @param {string} secretKey - 百度AI开放平台的Secret Key
     */
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.apm = new APM();
        this.kmsEncryption = new KmsEncryption();
    }

    /**
     * 获取访问令牌
     * @param {Object} [parentSpan=null] - 可选的父级APM span
     * @returns {Promise<string>} - 返回一个Promise对象，解析为访问令牌
     */
    async getAccessToken(parentSpan = null) {
        const span = this.apm.startSpan('getAccessToken', parentSpan);
        const encryptedApiKey = await this.kmsEncryption.encrypt(this.apiKey);
        const encryptedSecretKey = await this.kmsEncryption.encrypt(this.secretKey);
        this.apm.addTag(span, "apikey", encryptedApiKey.cipher_Text);
        this.apm.addTag(span, "secretKey", encryptedSecretKey.cipher_Text);
        this.apm.addTag(span, "method", "POST");
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

    /**
     * 识别地址
     * @param {string} accessToken - 访问令牌
     * @param {string} text - 要识别的地址文本
     * @param {Object} [parentSpan=null] - 可选的父级APM span
     * @returns {Promise<Object>} - 返回一个Promise对象，解析为识别结果
     */
    recognizeAddress(accessToken, text, parentSpan = null) {
        const span = this.apm.startSpan('recognizeAddress', parentSpan);
        this.apm.addTag(span, "text", { text });
        this.apm.addTag(span, "method", "POST");
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: `${ADDRESS_RECOGNITION_URL}?access_token=${accessToken}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { text }
            };
            this.apm.addTag(span, 'url', options.url);

            axios(options)
                .then(response => {
                    this.apm.addTag(span, 'recognized_address', response.data);
                    this.apm.addTag(span, "response", response.data);
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

module.exports = NewFeature;

