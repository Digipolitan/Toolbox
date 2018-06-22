const OSS = require('ali-oss');
const Promise = require('bluebird');
const FIFTEEN_MINUTES = 900;

const path = require('path');
const url = require('url');

const REQUIRED_PROPERTIES = [
    'accessKeyId',
    'accessKeySecret',
    'region',
    'bucket'
];

class OSSBlobsManager {
    /**
     *
     * @param configuration
     */
    constructor(configuration) {
        if (REQUIRED_PROPERTIES.some(p => !configuration[p]))
            throw new Error('Invalid Configuration Object');

        this.client = new OSS.Wrapper(configuration);
        this.configuration = configuration;

        this.configuration.signature = this.configuration.signature || {
                method: 'PUT',
                'content-type': 'text/plain',
                expires: FIFTEEN_MINUTES
            }
    }

    /**
     *
     * @param blobs, the blobs to create. expected format is: {name: String, path: String}
     * @returns an array containing {name: String, path: String, upload_url: String}
     */
    create(blobs) {
        const self = this;
        blobs = (blobs instanceof Array)
            ? blobs
            : [blobs];

        const hasInvalidBlobs = blobs.some(blob => !blob.name || !blob.path);

        if (hasInvalidBlobs)
            throw new Error('some.invalid.blobs');

        return blobs.map(create);

        function create(blob) {
            blob.path = path.join(blob.path, blob.name);
            blob.upload_url = self.client.signatureUrl(blob.path, self.configuration.signature);
            blob.url = (self.configuration.cdn && self.configuration.cdn.uri)
                ? url.resolve(self.configuration.cdn.uri, blob.path)
                : blob.upload_url.split('?')[0];

            return blob;
        }
    }

    /**
     *
     * @param blobs the blobs to delete
     * @returns {*} the responses from oss Aliyunn
     */
    remove(blobs) {
        blobs = (blobs instanceof Array)
            ? blobs
            : [blobs];

        const hasInvalidBlobs = blobs.some(blob => !blob.path);

        if (hasInvalidBlobs)
            return Promise.reject(new Error('some.invalid.blobs'));

        return Promise.map(blobs, blob => this.client.delete(blob.path))
    }
}

module.exports = OSSBlobsManager;