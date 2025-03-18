const {default: agent} = require('skywalking-backend-js');

class APM {

    start() {
        agent.start({
            serviceName: "MZAPI",
            collectorAddress: 'tracing-analysis-dc-sh.aliyuncs.com:8000',
            authorization: 'f3k5djwcqa@f749200e4d3f2ff_f3k5djwcqa@53df7ad2afe8301'
        });
    }
}

module.exports = APM;