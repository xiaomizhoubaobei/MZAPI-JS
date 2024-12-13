const initTracer = require('jaeger-client').initTracer

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
}

const options = {
  tags: {
    'xmzsdk.version': '1.0.0',
  },
}

const tracer = initTracer(config, options)

class APM {
  constructor() {
    this.tracer = tracer
  }

  startSpan(name) {
    return this.tracer.startSpan(name)
  }

  finishSpan(span) {
    span.finish()
  }

  addTags(span, tags) {
    for (const key in tags) {
      if (tags.hasOwnProperty(key)) {
        span.setTag(key, tags[key])
      }
    }
  }

  addTag(span, key, value) {
    span.setTag(key, value)
  }

  addMultipleTags(span, tags) {
    this.addTags(span, tags)
  }

  logCustomEvent(span, event, data) {
    span.log({ event, ...data })
  }
}

module.exports = APM
