const ALLOWED_LANGUAGES = ['fr', 'en'];

function getIssuerLanguage(context) {
    if (!context)
        throw new Error('missing context');

    const defaultLanguage = 'fr';
    let language = context.user
        && context.user.preferences
        && context.user.preferences.language
        && context.user.preferences.language.substring(0, 2).toLocaleLowerCase();

    if (!language)
        language = context.HTTP
            && context.HTTP.request
            && context.HTTP.request.header('content-language')
            && context.HTTP.request.header('content-language').substring(0, 2).toLocaleLowerCase();

    if (!language || !ALLOWED_LANGUAGES.some(l => l === language))
        return context.language = defaultLanguage;

    return context.language = language
}

module.exports = getIssuerLanguage;