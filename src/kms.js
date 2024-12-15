const { BasicCredentials } = require('@huaweicloud/huaweicloud-sdk-core');
const { KmsClient, EncryptDataRequest, EncryptDataRequestBody } = require('@huaweicloud/huaweicloud-sdk-kms/v2/public-api.js');

/**
 * KmsEncryption 类用于与华为云 KMS 服务进行交互，提供数据加密功能。
 */
class KmsEncryption {
    /**
     * 构造函数，初始化 KmsEncryption 类的实例。
     * 设置访问密钥、项目ID、终端节点和加密密钥ID，并创建 KMS 客户端。
     */
    constructor() {
        this.ak = 'CHRZSAE9JCAZCZRVQNNT'; // 访问密钥
        this.sk = 'Q2lFSm4QAxUiWtQHEIK0bTU5jURc8dvi27rVHv1u'; // 秘钥
        this.endpoint = "https://kms.cn-east-3.myhuaweicloud.com"; // KMS 服务的终端节点
        this.project_id = "0b28fa774900f5b02f02c01106ebdf08"; // 项目ID
        this.keyId = "f4258649-a384-407d-9d8c-15e785953f45"; // 加密密钥ID

        // 创建 BasicCredentials 对象并设置访问密钥、秘钥和项目ID
        const credentials = new BasicCredentials()
            .withAk(this.ak)
            .withSk(this.sk)
            .withProjectId(this.project_id);

        // 创建 KMS 客户端
        this.client = KmsClient.newBuilder()
            .withCredential(credentials)
            .withEndpoint(this.endpoint)
            .build();
    }

    /**
     * 使用 KMS 服务加密给定的文本。
     * @param {string} text - 需要加密的文本。
     * @returns {Promise<Object>} - 返回包含加密结果的 Promise 对象。
     */
    async encrypt(text) {
        const request = new EncryptDataRequest(); // 创建加密请求对象
        const body = new EncryptDataRequestBody(); // 创建加密请求体对象
        body.withPlainText(text); // 设置需要加密的文本
        body.withKeyId(this.keyId); // 设置加密密钥ID
        request.withBody(body); // 将请求体添加到请求对象中

        // 发送加密请求并返回结果
        try {
            const result = await this.client.encryptData(request);
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = KmsEncryption;
