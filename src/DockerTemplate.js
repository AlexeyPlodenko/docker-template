'use strict';

const nodeFs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

/**
 * @typedef private {string} _tpl
 * @typedef private {string} _tplFilePath
 * @typedef private {Object.<string, string|number>} _vars
 * @typedef private {string} _outputFilePath
 * @typedef private {string} _varOpenBracket
 * @typedef private {string} _varCloseBracket
 * @typedef private {RegExp} _varNameTestRegEx
 */
class DockerTemplate {
    /**
     * Constructor.
     */
    constructor() {
        this._tpl = undefined;
        this._tplFilePath = undefined;
        this._vars = undefined;
        this._outputFilePath = undefined;
        this._varOpenBracket = '%%';
        this._varCloseBracket = '%%';
        this._varNameTestRegEx = /^[a-z\d_.-]+$/i;
    }

    /**
     * @param {string} filePath
     */
    setTemplateFile(filePath) {
        if (typeof filePath !== 'string' || filePath === '') {
            throw new Error('1st argument "filePath" must be a non-empty string.');
        }

        this._tplFilePath = filePath;
    }

    /**
     * @param {string} filePath
     */
    setOutputFile(filePath) {
        if (typeof filePath !== 'string' || filePath === '') {
            throw new Error('1st argument "filePath" must be a non-empty string.');
        }

        this._outputFilePath = filePath;
    }

    /**
     * @param {string} template
     */
    setTemplate(template) {
        if (typeof template !== 'string') {
            throw new Error('1st argument "template" must be a string.');
        }

        this._tpl = template;
    }

    /**
     * @param {Object.<string, string|number>} variables
     */
    setVariables(variables) {
        if (typeof variables !== 'object') {
            throw new Error('1st argument "variables" must be an object.');
        }

        for (const k in variables) {
            if (variables.hasOwnProperty(k)) {
                if (
                    typeof k !== 'string'
                    || (
                        typeof variables[k] !== 'string'
                        && typeof variables[k] !== 'number'
                    )
                ) {
                    throw new Error(
                        '1st argument "variables" must be an object in format - '
                        + '{Object.<string, string|number>} or {key1: "value1", key2: "value2"}.'
                    );
                }
                if ( ! this._varNameTestRegEx.test(k)) {
                    throw new Error(
                        `All keys of the 1st argument "variables" must match the "${this._varNameTestRegEx}" reg. exp.`
                    );
                }
            }
        }

        this._vars = variables;
    }

    /**
     * @returns {string}
     */
    process() {
        let tpl;
        if (this._tplFilePath !== undefined) {
            if ( ! nodeFs.existsSync(this._tplFilePath)) {
                throw new Error('Template file does not exist.');
            }
            tpl = nodeFs.readFileSync(this._tplFilePath, 'utf8');

        } else if (this._tpl !== undefined) {
            tpl = this._tpl;

        } else {
            throw new Error(
                'Either a template or a template file must be set. '
                + 'Use DockerfileTpl.setTemplate() or DockerfileTpl.setTemplateFile() method to set them.'
            );
        }

        tpl = this._replaceVars(tpl);

        if (this._outputFilePath !== undefined) {
            nodeFs.writeFileSync(this._outputFilePath, tpl, 'utf8');
        }

        return tpl;
    }

    /**
     * @returns {string}
     */
    _replaceVars(tpl) {
        for (const k in this._vars) {
            if (this._vars.hasOwnProperty(k)) {
                // escaping tpl var.
                const varRegExPattern = escapeStringRegexp(this._varOpenBracket + k + this._varCloseBracket);
                const regEx = new RegExp(varRegExPattern, 'gm');
                tpl = tpl.replace(regEx, this._vars[k]);
            }
        }

        return tpl;
    }
}

module.exports = {
    DockerfileTpl
};
