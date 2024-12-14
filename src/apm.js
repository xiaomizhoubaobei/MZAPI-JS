import { initTracer } from 'jaeger-client';

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

class APM {
  constructor() {
    this.tracer = tracer;
  }

  startSpan(name, parentSpan = null) {
    const spanOptions = parentSpan ? { childOf: parentSpan } : undefined;
    return this.tracer.startSpan(name, spanOptions);
  }

  finishSpan(span) {
    span.finish();
  }

  addTags(span, tags) {
    for (const key in tags) {
      if (tags.hasOwnProperty(key)) {
        span.setTag(key, tags[key]);
      }
    }
  }

  addTag(span, key, value) {
    span.setTag(key, value);
  }
}

export default APM;
