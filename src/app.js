// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLabels = {
    LocalPicker: 'LocalPicker',
    Hotels: 'Hotels',
    Install: 'Install Software',
    Deinstall: 'Deinstall Software',
    Support: 'Support'
};

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'What do you want to do?',
            [DialogLabels.Install, DialogLabels.Deinstall, DialogLabels.Hotels],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option',
                listStyle: builder.ListStyle.button
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Flights:
                return session.beginDialog('flights');
            case DialogLabels.Hotels:
                return session.beginDialog('hotels');
        }
    }
]);

bot.dialog('install', require('./dialogs/install'));
bot.dialog('deinstall', require('./dialogs/deinstall'));

bot.dialog('localPicker', require('./dialogs/localPicker'))
    .triggerAction({
        matches: [/language/i, /sprache/i]
    });
bot.dialog('hotels', require('./dialogs/hotels'));
bot.dialog('support', require('./dialogs/support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});
