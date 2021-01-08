import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import pug from 'pug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (req, res, next) => {

    const templateData = req.body;
    const templateLocation = join(__dirname, `../templates/mail/${ res.locals.template }.pug`);
    const templateRendered = pug.renderFile(templateLocation, templateData);

    res.locals.template = templateRendered;

    next();
}
