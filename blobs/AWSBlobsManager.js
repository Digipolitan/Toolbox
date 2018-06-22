const AWS = require('aws-sdk');
const Promise = require('bluebird');
const FIFTEEN_MINUTES = 900;
const path = require('path');

const REQUIRED_PROPERTIES = [
    'accessKeyId',
    'secretAccessKey',
    'region',
    'bucket'
];

class AWSBlobsManager {
    constructor(configuration) {
        if (typeof configuration !== 'object' || Object.keys(configuration).sort().join() !== REQUIRED_PROPERTIES.sort().join())
            throw new Error('Invalid Configuration Object');
        this.client = new AWS.S3(configuration);
        this.configuration = configuration;
    }

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
            blob.upload_url = self.client.getSignedUrl('putObject', {
                Bucket: self.configuration.bucket,
                Key: blob.path,
                ACL: 'public-read',
                Expires: FIFTEEN_MINUTES
            });
            blob.url = blob.upload_url.split('?')[0];
            return blob;
        }
    }

    remove(blobs) {
        const self = this;
        blobs = (blobs instanceof Array)
            ? blobs
            : [blobs];

        const hasInvalidBlobs = blobs.some(blob => !blob.path);

        if (hasInvalidBlobs)
            return Promise.reject(new Error('some.invalid.blobs'));

        return Promise.map(blobs, remove);

        function remove(blob) {
            return new Promise((resolve, reject) => {
                return self.client.deleteObject({
                    Bucket: self.configuration.bucket,
                    Key: blob.path,
                }, (err, data) => (err) ? reject(err) : resolve(data));
            })
        }
    }
}

module.exports = AWSBlobsManager;