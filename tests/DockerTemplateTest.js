'use strict';

const assert = require('assert');
const {DockerTemplate} = require('../src/DockerTemplate');

assert.ok((() => {
    const dockerTpl = new DockerTemplate();
    return (
           typeof dockerTpl === 'object'
        && dockerTpl instanceof DockerTemplate
    );
})(), 'DockerTemplate class instance creates');

console.log('Tests have passed successfully.');
