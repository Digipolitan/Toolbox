let sut;

module.exports = describe('localizable', () => {
    before(() => {
        sut = require('./rules');
    });

    describe('ensureRequiredProperties', () => {

        it('(Simple) should return the field missing concat in a string', () => {
            context.data = data;
            sut.ensureRequiredProperties('data', ['tooto'])(context)
                .should.deep.equal('data.tooto');
        })

        it('(Array) should return the correct String localized', () => {
            context.data = dataArray;
            sut.ensureRequiredProperties('data', ['toto'])(context)
                .should.deep.equal('data[1].toto');
        })
    });

    describe('ensureObjectIds', () => {

        it('(Simple) should return the field missing concat in a string', () => {
            context.data = data;
            sut.ensureRequiredProperties('data', ['tooto'])(context)
                .should.deep.equal('data.tooto');
        })

        it('(Array) should return the correct String localized', () => {
            context.data = dataArray;
            sut.ensureRequiredProperties('data', ['toto'])(context)
                .should.deep.equal('data[1].toto');
        })
    });
});

let context = {
    error
}

let data = {
    toto: "toto"
}

let dataArray = [
    {
        toto: "toto"
    },
    {}]

function error(code, errorKey, args) {
    return args;
}



