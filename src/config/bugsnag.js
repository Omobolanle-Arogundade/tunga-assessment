import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import config from 'config';

Bugsnag.start({
 apiKey: config.bugsnag.apiKey,
 plugins: [BugsnagPluginExpress],
 logger: null,
 releaseStage: config.env,
});

export default Bugsnag;
