import cors from 'cors';

export default (req, res, next) => {

    // persist the request's origin in a URL object
    res.locals.origin = new URL(req.headers.origin);

    // Iterate over the map of clients to establish whether the origin of the request
    // is whitelisted in one of the declared form configurations in clients.yaml
    const clientIsAuthorized = (() => {
        for (const [formID, formConfig] of res.locals.clients) {
            if (formConfig.client === res.locals.origin.hostname) return true;
        };
        return false;
    })();

    cors({
        origin: function (origin, callback) {

            // short-circuit will execute callback with Error if we can't identify the client
            clientIsAuthorized || callback(new Error('Client violates CORS policy.'));

            // client is whitelisted, proceed
            callback(null, true);
        }
    })(req, res, next);

}
