let sut;
module.exports = describe('fields', () => {
    before(() => {
        sut = require('../');
    });

    describe('isEmail', () => {
        it('should return true when a correct email is passed', () => {
            sut.fieldsValidator.isEmail("test@test.fr").should.deep.equal(true);
        });

        it('should return false when an incorrect email is passed', () => {
            sut.fieldsValidator.isEmail("test.fr").should.deep.equal(false);
        });

        it('should return true with TEST.@tt.cr', () => {
            sut.fieldsValidator.isEmail("TEST.@tt.cr").should.deep.equal(true);
        });

        it('should return true with -(TEST._@t_t.cr', () => {
            sut.fieldsValidator.isEmail("TEST.@tt.cr").should.deep.equal(true);
        });

    });

    describe('hasProperties', () => {
        it('should return true when passed object contains given properties', () => {
            sut.fieldsValidator.hasProperties(
                {
                    field: 0,
                },
                ['field'])
                .should.deep.equal([]);
        });

        it('should return missing fields when passed object does not given properties', () => {
            let requiredFields = ['field', 'field2'];
            sut.fieldsValidator.hasProperties(
                {
                    field: 0,
                },
                requiredFields)
                .should.deep.equal(['field2']);
        });
    });

    describe('hasLength', () => {
        it('should return true when passed string length is between min and max', () => {
            sut.fieldsValidator.hasLength("123456", 2, 6).should.equal(true);
        });

        it('should return false when passed string length is below min', () => {
            sut.fieldsValidator.hasLength("123456", 7, 8).should.equal(false);
        });

        it('should return false when passed string length is above max', () => {
            sut.fieldsValidator.hasLength("123456", 0, 5).should.equal(false);
        });
    });

    describe('whitelist', () => {
        it('should remove everything from data that is not in given properties array', () => {
            let data = {
                field: 0,
                field1: 0
            };
            sut.fieldsValidator.whitelist(data,
                ['field']);
            data.should.deep.equal({field: 0});
        });
    });

    describe('blacklist', () => {
        it('should remove everything from data that is in given properties array', () => {
            let data = {
                field: 0,
                field1: 0,
                field2: 0
            };
            sut.fieldsValidator.blacklist(data,
                ['field', 'field2']);
            data.should.deep.equal({field1: 0});
        });
    });

});

