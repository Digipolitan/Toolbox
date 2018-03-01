let sut;

module.exports = describe('localizable', () => {
    before(() => {
        sut = require('./rules');
    });

    describe('ensureRequiredProperties()', () => {
        it('(Simple) should return true when field is present', () => {
            context.data = data;
            sut.ensureRequiredProperties('data', ['item'])(context)
                .should.deep.equal(true);
        })

        it('(Simple) should return the fields missing concat in a string', () => {
            context.data = data;
            sut.ensureRequiredProperties('data', ['test'])(context)
                .should.deep.equal(['data.test']);
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
    invalidArray: []
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



