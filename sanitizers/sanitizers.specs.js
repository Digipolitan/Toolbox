let sut;

module.exports = describe('sanitizers', () => {
    before(() => {
        sut = require('./sanitizers');
    });

    describe('whitelistProperties()', () => {
        it('should remove all fields except the whitelisted one', () => {
            context.data = data;
            sut.whitelistProperties('data', ['listed'])(context);
            context.data.should.deep.equal({
                listed: "bar"
            });
        })
    });

    describe('blacklistProperties()', () => {
        it('should remove all blacklisted fields', () => {
            context.data = data;
            sut.blacklistProperties('data', ['listed'])(context);
            context.data.should.deep.equal({});
        })

    });

    describe('trimProperties()', () => {
        it('should trim all specified fields', () => {
            context.data = trimData;
            sut.trimProperties('data', ['trim'])(context);
            context.data.should.deep.equal(trimedData);
        })

    });

    describe('capitalizeProperties()', () => {
        it('should capitalize all specified fields', () => {
            context.data = capitalizeData;
            sut.capitalizeProperties('data', ['capitalize'])(context);
            context.data.should.deep.equal(capitalizedData);
        })
    });

    describe('uppercaseProperties()', () => {
        it('should capitalize all specified fields', () => {
            context.data = uppercaseData;
            sut.uppercaseProperties('data', ['uppercase'])(context);
            context.data.should.deep.equal(uppercasedData);
        })
    });

    describe('lowercaseProperties()', () => {
        it('should capitalize all specified fields', () => {
            context.data = lowercaseData;
            sut.lowercaseProperties('data', ['lowercase'])(context);
            context.data.should.deep.equal(lowercasedData);
        })
    });
});

let context = {}

let data = {
    item: "value",
    listed: "bar",
}

let trimData = {
    trim: "  valu e    "
}

let trimedData = {
    trim: "valu e"
}

let capitalizeData = {
    capitalize: "value"
}

let capitalizedData = {
    capitalize: "Value"
}

let lowercaseData = {
    lowercase: "VALUE"
}

let lowercasedData = {
    lowercase: "value"
}

let uppercaseData = {
    uppercase: "value"
}

let uppercasedData = {
    uppercase: "VALUE"
}