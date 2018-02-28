const Sanitizer = require('./sanitizer');

describe('.start()', () => {

    describe('when configuration is correct', () => {

        it('should succeed', (done) => {
            Sanitizer.init(config)
                .start(ImportFileJSON.users)
                .should.be.fulfilled
                .and.notify(done);
        });

    });

    describe('when there is no configuration', () => {
        it("should fail when no configuration is given", () => {
            (() => {
                Sanitizer.init(null).start(ImportFileJSON.users)
            }).should.throw(Error)
        });

    });

    describe('when there is no functions in the configuration', () => {
        it("should fail when there is no function to apply", () => {
            (() => {
                Sanitizer.init(noFunctionsConfig).start(ImportFileJSON.users)
            }).should.throw(Error)
        });

    });


    describe('when there is no field in the configuration functions object', () => {
        it("should fail when there is no field in functions object", () => {
            (() => {
                Sanitizer.init(functionsFieldMissingConfig).start(ImportFileJSON.users)
            }).should.throw(Error)
        });

    });

});

const config = {

    functions: {
        first_name: ['upperCase', 'trim'],
        last_name: ['upperCase', 'trim'],
    },

    full_stack_trace: true,
    strict_mode: true,

};


const noFunctionsConfig = {
    functions: {},
    full_stack_trace: true,
    strict_mode: true,
};


const functionsFieldMissingConfig = {
    full_stack_trace: true,
    strict_mode: true,
};

const ImportFileJSON = {
    "organization": {
        "id": "5a7c64f9b252e74315f9bb6a"
    },
    "users": [
        {
            "email": "lixiaohe925@hotmail.com",
            "password": "loginchinese2018",
            "first_name": "    Xiaohe   ",
            "last_name": "   EIPACA LI    ",
            "kind": "Education",
            "role": "teacher"
        },
        {
            "email": "maelle.picard@loginchinese.com",
            "password": "loginchinese2018",
            "first_name": "Maelle",
            "last_name": "Picard",
            "kind": "Education",
            "role": "student",
            "subordinate_of": "lixiaohe925@hotmail.com"
        }

    ],
    "offer": {
        "id": "59285b2e5dbaf200118ed621"
    }
};


