function slugger() { // to avoid the regex global scope
    const regex = /([A-z]+)-L([0-9]+)M([0-9]+)U([0-9]+)-([0-9]+)/;

    function getDataFrom(slug) {
        const result = regex.exec(slug) || [];
        const data = {};

        data.slug = slug;
        data.theme = result[1] || null;
        data.level = parseInt(result[2]) || null;
        data.module = parseInt(result[3]) || null;
        data.unit = parseInt(result[4]) || null;
        data.order = parseInt(result[5]) || null;

        return data;
    }

    function validate(slug) {
        return regex.test(slug)
    }

    return {
        getDataFrom,
        validate
    };
}


module.exports = slugger();






