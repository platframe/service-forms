import nodemailer from 'nodemailer';
import express from 'express';
const router = express.Router();

// The 'sendMail' routine uses 'nodemailer' to relay
// the incoming message to a designated mail server.
const mailSend = (req, res) => {

    const {
        host, port, secure, auth: { user, pass }
    } = res.locals.mailboxes[res.locals.mailbox];

    const settings = {
        from:    res.locals.from + ' ' + res.locals.email,
        to:      res.locals.recipients,
        subject: res.locals.subject,
        text:    res.locals.message,
        html:    res.locals.template,
    };

    // create carrier using the default method (SMTP)
    const carrier = nodemailer.createTransport({
        host, port, secure, auth: { user, pass }
    });

        const result = carrier.sendMail(settings);

        result.then(info => {
            res.json({
                'responseCode': 0,
                'description': 'Success: message delivered',
            })
        })
        .catch(error => {
            res.json({
                'responseCode': 1,
                'description': `Error: ${ error.message }`,
            })
        });

};

///////////////// ROUTES : POST

/***  /send
if you won't be handling file uploads from users, tell multer
not to bother with it by invoking its 'none()' method as this
will ensure it attaches only textual data to the request.body
************************************************************/

export default router.post('/', mailSend);
