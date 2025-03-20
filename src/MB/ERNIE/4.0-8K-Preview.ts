import BaiduERNIEBase from '../ulis/base';

/**
 * Ernie4_8K_Preview类用于与百度文心大模型 API进行交互
 *
 * 该类继承自BaiduERNIEBase，提供了与百度文心大模型4.0-8K版本API交互的功能。
 * 主要功能包括：
 * - 自动获取和管理访问令牌
 * - 发送对话请求并处理响应
 * - 参数验证和错误处理
 *
 * @example
 * ```typescript
 * const ernie = new Ernie4_8K_Preview('your_api_key', 'your_secret_key');
 * const messages: Message[] = [
 *   { role: 'user', content: '你好' }
 * ];
 * const response: APIResponse = await ernie.sendRequest(messages);
 * console.log(response);
 * ```
 */
class Ernie4_8K_Preview extends BaiduERNIEBase {
    /**
     * 创建Ernie4_8K_Preview实例
     * @param {string} apiKey - 百度API的客户端ID，用于身份验证
     * @param {string} secretKey - 百度API的客户端密钥，用于身份验证
     * @throws {Error} 如果apiKey或secretKey为空或无效，将抛出错误
     * @example
     * ```typescript
     * const ernie = new Ernie4_8K_Preview('your_api_key', 'your_secret_key');
     * ```
     */
    constructor(apiKey: string, secretKey: string) {
        const apiUrl: string = BaiduERNIEBase.BASE_URL + 'ernie-4.0-8k-preview';
        super(apiKey, secretKey, apiUrl);
    }
}

export default Ernie4_8K_Preview;