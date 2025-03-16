const axios = require('axios');

/**
 * BaiduAuth类用于处理百度API的鉴权
 */
class BaiduAuth {
    /**
     * 创建BaiduAuth实例
     * @param {string} clientId - 百度API的客户端ID
     * @param {string} clientSecret - 百度API的客户端密钥
     */
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token';
    }

    /**
     * 获取百度API的访问令牌
     * @returns {Promise<string>} 返回访问令牌
     * @throws {Error} 如果获取令牌失败，抛出错误
     */
    async getToken() {
        const options = {
            method: 'POST',
            url: `${this.tokenUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        try {
            const response = await axios(options);
            return response.data.access_token;
        } catch (error) {
            throw new Error(`获取百度API鉴权令牌失败: ${error.message}`);
        }
    }
}

module.exports = BaiduAuth;