const { initTracer } = require('jaeger-client');

const config = {
  serviceName: 'xmzsdk-js',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
    collectorEndpoint: 'http://ap-shanghai.apm.tencentcs.com:14268/api/traces',
  },
};

const options = {
  tags: {
    token: 'kCrxvCIYEzhZfAHETXEB',
    'xmzsdk.version': '1.0.0',
  },
};

const tracer = initTracer(config, options);

/**
 * APM 类用于应用性能管理，提供创建和管理追踪 span 的功能。
 */
class APM {
  /**
   * 构造函数，初始化 APM 类的实例。
   * 设置 tracer 对象。
   */
  constructor() {
    this.tracer = tracer;
  }

  /**
   * 开始一个新的 span。
   * @param {string} name - span 的名称。
   * @param {Object} [parentSpan=null] - 可选的父级 span。
   * @returns {Object} - 返回创建的 span 对象。
   */
  startSpan(name, parentSpan = null) {
    const spanOptions = parentSpan ? { childOf: parentSpan } : undefined;
    return this.tracer.startSpan(name, spanOptions);
  }

  /**
   * 结束一个 span。
   * @param {Object} span - 要结束的 span 对象。
   */
  finishSpan(span) {
    span.finish();
  }

  /**
   * 为 span 添加多个标签。
   * @param {Object} span - 要添加标签的 span 对象。
   * @param {Object} tags - 包含标签键值对的对象。
   */
  addTags(span, tags) {
    for (const key in tags) {
      if (tags.hasOwnProperty(key)) {
        span.setTag(key, tags[key]);
      }
    }
  }

  /**
   * 为 span 添加一个标签。
   * @param {Object} span - 要添加标签的 span 对象。
   * @param {string} key - 标签的键。
   * @param {string} value - 标签的值。
   */
  addTag(span, key, value) {
    span.setTag(key, value);
  }
}

module.exports = APM;
