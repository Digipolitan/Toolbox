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

describe('rules', () => {
    require('../rules/rules.specs');
});
