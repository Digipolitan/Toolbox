let sut;

before((done) => {
    sut = require('../index');
    done();
});

describe('errors', () => {
    require('../localizable/localizable.specs');
});

describe('validators', () => {
    require('../validators/fieldsValidator.specs');
});

require('../rules/rules.specs');

// describe('sanitizer', () => {
//    require('../sanitizer/sanitizer.specs');
// });

describe('misc', function () {
    require('../misc/getIssuerLanguage.specs');
});
