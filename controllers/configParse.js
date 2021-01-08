import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { promises as fs } from 'fs';
import yaml from 'yaml';

// __filename, __dirname is not passed in when using ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function clients(req, res, next) {

    try {

        let file = await fs.readFile(join(__dirname, '../settings/clients.yaml'), 'utf-8');
        // parse the YAML file into a dictionary
        const clientsObj = yaml.parse(file);
        // Convert the dictionary into an ES2015 map. Object.entries
        // return an array whose elements are arrays of [key, value]
        // pairs. Persist onto "locals" object for downstream use.
        res.locals.clients = new Map(Object.entries(clientsObj));

    } catch (error) {
        next(error);
    }

    next();

}

async function mailboxes(req, res, next) {

    try {
        const file = await fs.readFile(join(__dirname, '../settings/mailboxes.yaml'), 'utf-8');
        res.locals.mailboxes = yaml.parse(file);
    } catch (error) {
        next(error);
    }

    next();

}

export default [
    clients,
    mailboxes,
];

/* note: schema of the map we're creating at `res.locals.clients`:
    Map([
        ['form_1', {
            client: 'example.com',
            mailbox: 'default',
            subject: 'Message from Example.com',
            template: 'example_1',
            recaptcha: '6LcTTNkZAAaQABof07_Y3SZ6HOsL0cmKwEj9Ys9s',
            recipients: [
                'inbox@example.com',
            ],
        }],
]); */
