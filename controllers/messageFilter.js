import https from 'https';
import querystring from 'querystring';

export default (req, res, next) => {

    // Compose the outgoing request. Google reCAPTCHA's API
    // expects a POST request with a query string as its body.
    const payload = querystring.stringify({
        // set reCAPTCHA API private key
        secret: res.locals.recaptcha,
        // set reCAPTCHA session token received from the client
        response: req.body.token,
    });

    const settings = {
        port: 443,
        method: 'POST',
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': Buffer.byteLength(payload),
        }

    };

    const processResponse = (chunks) => {
        // concatenate and encode the raw integer buffer into a string
        const responseBody = Buffer.concat(chunks)
        // parse the JSON string into an object and destructure
        const { success, score, action } = JSON.parse(responseBody);
        // if everything checks out, proceed to the next piece of middleware
        if (
            success &&
            score >= 0.5 &&
            action === res.locals.id) {
            next()
        } else {
            // the message failed the SPAM check
            res.json({
                'responseCode': 1,
                'description': 'Message failed integrity test',
            });
        };
    }

    const request = https.request(settings, response => {

        // store data chucks from response
        const chunks = [];

        if (response.headers['content-type'].includes('application/json')) {
            response.on('data', chunk => {
                // Google responds with stringified JSON and
                // at this stage we're receiving a raw buffer
                chunks.push(chunk);
            });
        } else {
            res.json({
                'responseCode': 1,
                'description': 'Invalid content type: expected JSON',
            })
        }

        response.on('end', () => processResponse(chunks));
    });

    // attach the data we're sending to request body
    request.write(payload);

    // handle all other errors
    request.on('error', (e) => {
        res.json({
            'responseCode': 1,
            'description': `SPAM service error: ${ e.message }`,
        })
    });

}
