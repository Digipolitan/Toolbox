let sut;

module.exports = describe('rules', () => {
    before(() => {
        sut = require('./rules');
    });

    describe('ensureRequiredProperties()', () => {
        it('(Simple) should return true when field is present', () => {
            context.data = data;
            sut.ensureRequiredProperties('data', ['item'])(context)
                .should.deep.equal(true);
        })

        it('(Simple) should return true when field is present in context', () => {
            context.data = data;
            sut.ensureRequiredProperties(null, ['error'])(context)
                .should.deep.equal(true);
        })

        it('(Simple) should return true when field is present in context', () => {
            context.data = data;
            sut.ensureRequiredProperties('', ['error'])(context)
                .should.deep.equal(true);
        })

        it('(Simple) should return true when field is present in context', () => {
            context.data = data;
            sut.ensureRequiredProperties('context', ['error'])(context)
                .should.deep.equal(true);
        })

        it('(Simple) should return true when field is present in context', () => {
            context.data = data;
            sut.ensureRequiredProperties(undefined, ['error'])(context)
                .should.deep.equal(true);
        })

        it('(Simple) should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureRequiredProperties(null, ['missingField'])(context)
                .should.deep.equal(['context.missingField']);
        })

        it('(Simple) should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureRequiredProperties('data', ['missingField'])(context)
                .should.deep.equal(['data.missingField']);
        })

        it('(Array) should return true if the fields are present in each item if Array', () => {
            context.data = dataArray;
            sut.ensureRequiredProperties('data', ['item'])(context)
                .should.deep.equal(true);
        })

        it('(Array) should return the fields missing concat in a string', () => {
            context.data = dataArray;
            sut.ensureRequiredProperties('data', ['item2'])(context)
                .should.deep.equal(['data[1].item2']);
        })
    });

    describe('ensureObjectIds()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureObjectIds('data', ['objectId'])(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureObjectIds('data', 'objectId')(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureObjectIds('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureObjectIds('data', ['invalidObjectId'])(context)
                .should.deep.equal(['data.invalidObjectId']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureObjectIds('data', ['missingField'])(context)
                .should.deep.equal(['data.missingField']);
        })
    });

    describe('ensureArrays()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureArrays('data', ['array'], {min: 1, max: 2})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureArrays('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureArrays('data', ['invalidArray'], {min: 1, max: 2})(context)
                .should.deep.equal([1, 2, 'data.invalidArray']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureArrays('data', ['missingField'])(context)
                .should.deep.equal(['none', 'none', 'data.missingField']);
        })
    });

    describe('ensureStrings()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureStrings('data', ['string'], {min: 1, max: 4})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureStrings('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureStrings('data', ['invalidString'], {min: 1, max: 4})(context)
                .should.deep.equal([1, 4, 'data.invalidString']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureStrings('data', ['missingField'])(context)
                .should.deep.equal(['none', 'none', 'data.missingField']);
        })
    });

    describe('ensureNumbers()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureNumbers('data', ['number'], {min: 1, max: 4})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureNumbers('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureNumbers('data', ['invalidNumber'], {min: 1, max: 4})(context)
                .should.deep.equal([1, 4, 'data.invalidNumber']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureNumbers('data', ['missingField'])(context)
                .should.deep.equal(['none', 'none', 'data.missingField']);
        })
    });

    describe('ensureEmails()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureEmails('data', ['email'], {min: 1, max: 4})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureEmails('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureEmails('data', ['invalidEmail'])(context)
                .should.deep.equal(['data.invalidEmail']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureEmails('data', ['missingField'])(context)
                .should.deep.equal(['data.missingField']);
        })
    });

    describe('ensurePhoneNumbers()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensurePhoneNumbers('data', ['phone'], {min: 1, max: 4})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensurePhoneNumbers('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensurePhoneNumbers('data', ['invalidPhone'])(context)
                .should.deep.equal(['data.invalidPhone']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensurePhoneNumbers('data', ['missingField'])(context)
                .should.deep.equal(['data.missingField']);
        })
    });

    describe('ensureSlugs()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureSlugs('data', ['slug'], {min: 1, max: 4})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureSlugs('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureSlugs('data', ['invalidSlug'])(context)
                .should.deep.equal(['data.invalidSlug']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureSlugs('data', ['missingField'])(context)
                .should.deep.equal(['data.missingField']);
        })
    });

    describe('ensureDates()', () => {
        it('should return true if the fields are correct', () => {
            context.data = data;
            sut.ensureDates('data', ['date'], {min: 1, max: 4})(context)
                .should.deep.equal(true);
        })

        it('should return true if the fields are missing but not required', () => {
            context.data = data;
            sut.ensureDates('data', ['missingField'], {required: false})(context)
                .should.deep.equal(true);
        })

        it('should return the invalid fields concat in a string', () => {
            context.data = data;
            sut.ensureDates('data', ['invalidDate'])(context)
                .should.deep.equal(['data.invalidDate']);
        })

        it('should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureDates('data', ['missingField'])(context)
                .should.deep.equal(['data.missingField']);
        })
    });
});

let context = {
    error
}

let data = {
    item: "value",
    objectId: "5a8bfcdd551f7805e6bc3dcc",
    invalidObjectId: "zerfdg",
    number: 3,
    invalidNumber: "sdfsd",
    string: "test",
    invalidString: {},
    array: [{}],
    invalidArray: [],
    email: 'test@test.fr',
    invalidEmail: 'sdfiodfj',
    phone: '0102030405',
    invalidePhone: 'sdf',
    slug: 'academic-L1M12U3-6',
    invalidSlug: '-L1M1academic2U3-6',
    date: '2012-12-12 12:12',
    invalidDate: 'rickroll'
}

let dataArray = [
    {
        item: "value",
        item2: "value"
    },
    {
        item: "test"
    }
]

function error(code, errorKey, ...args) {
    return args;
}



