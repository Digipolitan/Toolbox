const assert = require('assert');
const sinon = require('sinon');
let sut;

module.exports = describe('getIssuerLanguage', () => {
    before(() => {
        sut = require('./getIssuerLanguage');
    });

    describe('when there is no context', () => {
        it('should throw an error with missing context', () => {
            assert.throws(() => {sut()}, Error, 'missing context')
        });
    });

    describe('when the user has a valid language preferences', () => {
        it('should use it', () => {
            const context = { user: { preferences: { language: 'en' } } };
            const result = sut(context);

            context.should.have.property('language', 'en');
            result.should.equal('en');
        });
    });

    describe('when the user has an invalid language preferences', () => {
        it('should use the default', () => {
            const context = { user: { preferences: { language: 'ch' } } };
            const result = sut(context);

            context.should.have.property('language', 'fr');
            result.should.equal('fr');
        });
    });

    describe('when the user does not have a language in its preferences', () => {
        describe('and there is an information about the language in the HTTP request', () => {
            it('should use the information from the HTTP request', () => {
                const request = {
                    header: () => {
                    }
                };
                const context = { HTTP: { request } };

                const mock = sinon.mock(request);
                mock.expects('header')
                    .once()
                    .returns('en-EN');

                const result = sut(context);

                context.should.have.property('language', 'en');
                result.should.equal('en');
                mock.verify();
            });

            describe('and the HTTP request contains invalid information', () => {
                it('should use the information from the HTTP request', () => {
                    const request = {
                        header: () => {
                        }
                    };
                    const context = { HTTP: { request } };
                    const mock = sinon.mock(request);
                    mock.expects('header')
                        .once()
                        .returns('ch-CH');

                    const result = sut(context);

                    context.should.have.property('language', 'fr');
                    result.should.equal('fr');
                    mock.verify();
                });
            });

            describe('and there is no information about the language', () => {
                it('should use the default language (fr)', () => {
                    const context = {};
                    const result = sut(context);

                    context.should.have.property('language', 'fr');
                    result.should.equal('fr');
                });
            });

        });
    });
});
