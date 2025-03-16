const axios = require('axios');
const BaiduAuth = require("./ulis/baiduauth");
const APM = require("../ulis/apm");

/**
 * Ernie4_8K类用于与百度文心大模型4.0-8K API进行交互
 */
class Ernie4_8K {
    /**
     * 创建Ernie4_8K实例
     * @param {string} apiKey - 百度API的客户端ID
     * @param {string} secretKey - 百度API的客户端密钥
     */
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.apiUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro';
        this.apm = new APM();
    }
    /**
     * 获取百度API的访问令牌
     * @returns {Promise<string>} 返回访问令牌
     */
    async getAccessToken() {
        const baiduAuth = new BaiduAuth(this.apiKey, this.secretKey);
        return await baiduAuth.getToken();
    }

    /**
     * 向百度文心大模型发送请求
     * @param {Array} messages - 对话消息数组，必须是非空数组且长度为奇数
     * @param {number} temperature - 采样温度，控制输出的随机性
     * @param {number} top_p - 采样参数，控制输出token的多样性
     * @param {number} penalty_score - 重复惩罚系数，用于降低重复生成的概率
     * @param {number} max_output_tokens - 最大输出token数量
     * @returns {Promise<Object>} 返回API的响应数据
     * @throws {Error} 如果参数校验失败或API请求失败，抛出错误
     */
    async sendRequest(messages, temperature = 0.8, top_p = 0.8, penalty_score = 1.0, max_output_tokens = 1024) {
        // 校验messages参数
        if (!Array.isArray(messages) || messages.length === 0 || messages.length % 2 !== 1) {
            throw new Error('messages参数必须是非空数组且长度为奇数');
        }
        if (typeof temperature !== 'number' || temperature <= 0 || temperature > 1.0) {
            if (typeof top_p !== 'number' || top_p < 0 || top_p > 1.0) {
                throw new Error('top_p参数必须是数字且取值范围为[0, 1.0]');
            }
            if (typeof penalty_score !== 'number' || penalty_score < 1.0 || penalty_score > 2.0) {
                throw new Error('temperature参数必须是数字且取值范围为(0, 1.0]');
            }
            if (typeof max_output_tokens !== 'number' || max_output_tokens < 2 || max_output_tokens > 2048) {
                throw new Error('max_output_tokens参数必须是数字且取值范围为[2, 2048]');
            }
        }
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (i % 2 === 0 && message.role !== 'user') {
                throw new Error(`第${i + 1}个message的role必须为user`);
            }
            if (i % 2 === 1 && message.role !== 'assistant') {
                throw new Error(`第${i + 1}个message的role必须为assistant`);
            }
        }
        const totalLength = messages.reduce((sum, msg) => sum + (msg.content || '').length, 0);
        if (totalLength > 20000) {
            throw new Error('messages中所有content的总长度不能超过20000个字符');
        }

        const accessToken = await this.getAccessToken();
        const options = {
            method: 'POST',
            url: `${this.apiUrl}?access_token=${accessToken}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messages,
                temperature,
                top_p,
                penalty_score,
                max_output_tokens
            })
        };
        this.apm.start();
        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            throw new Error(`API请求失败: ${error.message}`);
        }
    }
}

module.exports = Ernie4_8K;