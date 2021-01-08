// preflight checks
// Are we running in the correct environment?
if (parseFloat(process.versions.node) < 12) {
    console.warn('⚠ This service requires at least v12 of Node');
    process.exit();
}

// DEPENDENCIES: EXTERNAL
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MIDDLEWARE
// controllers
import settings from './controllers/configParse.js';
import formParse from './controllers/formParse.js';
import clientFilter from './controllers/clientFilter.js';
import messageFilter from './controllers/messageFilter.js';
import dataNormalize from './controllers/dataNormalize.js';
import templateRender from './controllers/templateRender.js';

// routes
import send from './routes/forms.js';

// META
const port = 3030;
const host = '127.0.0.1';

// APPLICATION
const app = express();

app.set('view engine', 'pug');
app.set('views', join(__dirname, 'templates'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// uncomment if serving public statics
// app.use(express.static(join(__dirname, 'public')));

// Forms service does not concern itself with GET calls
// so this catch-all will respond to all such requests.
if (process.env.NODE_ENV === 'development') {
    app.get("*", (req, res) => res.render('web/index'));
} else {
    app.get("*", (req, res) => res.sendStatus(404));
}

// 1. get the settings
app.use(settings);

// 2. defensive sieve for incoming requests
app.use(clientFilter);

// 3. parse the incoming form data
app.use(formParse);

// 4. massage data
app.use(dataNormalize);

// 5. filter out potential SPAM
app.use(messageFilter);

// 6. render HTML email template
app.use(templateRender);

// 7. compose and send the email
app.use('/', send);

app.listen(port, host, () => {
    console.log(`Platframe Forms Service is live at http://${ host }:${ port }/`);
});
