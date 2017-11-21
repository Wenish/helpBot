var builder = require('botbuilder');

module.exports = [
    function (session) {
        // Prompt the user to select their preferred locale
        builder.Prompts.choice(session,
          'What\'s your preferred language?',
          'English|Deutsch|Pirate',
          {
            listStyle: builder.ListStyle.button
          });
    },
    function (session, results) {
        // Update preferred locale
        var locale;
        switch (results.response.entity) {
            case 'English':
                locale = 'en';
                break;
            case 'Deutsch':
                locale = 'de';
                break;
            case 'Pirate':
                locale = 'pirate';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog(`Your preferred language is now ${results.response.entity}`);
            } else {
                // Problem loading the selected locale
                session.error(err);
            }
        });
    }
]
