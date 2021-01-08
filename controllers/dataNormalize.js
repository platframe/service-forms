export default (req, res, next) => {

    // get current client's configuration and set onto locals
    res.locals.client = res.locals.clients.get(req.body.id);

    res.locals.id = req.body.id;
    res.locals.email = req.body.email;
    res.locals.message = req.body.message;
    res.locals.subject = res.locals.client.subject;
    res.locals.mailbox = res.locals.client.mailbox;
    res.locals.template = res.locals.client.template;
    res.locals.recipients = res.locals.client.recipients;

    // data specific to Google reCAPTCHA
    res.locals.token = res.locals.client.token;
    res.locals.recaptcha = res.locals.client.recaptcha;

    // The name field can either combine First and Last names, or keep
    // them as separate form fields. Here we normalize into one string.
    res.locals.from = req.body.name
        ? req.body.name
        : `${ req.body.nameFirst } ${ req.body.nameLast }`;

    next();
}
