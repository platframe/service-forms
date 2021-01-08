import multer from 'multer';

const upload = multer();

export default (req, res, next) => {

    if (req.headers['content-type'].includes('multipart/form-data')) {
        // decode form data and attach to req.body; since we
        // won't accept any file uploads, we invoke .none()
        upload.none()(req, res, next);
    } else {
        // respond with 412 (Precondition Failed)
        res.status(412).send('Error: incorrect form encoding.');
    }
}
