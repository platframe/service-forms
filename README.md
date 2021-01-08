## service: forms

Node API that handles the processing and sending of form data over SMTP to a POP/IMAP mail server.  

- Built to work with Platframe's client-side `form` [module](https://platframe.com/docs/#logic-modules-included-form), but can work as a client-agnostic service.
- Service multiple clients/sites. 
- Support for multiple forms per client, each paired with an email template.
- New clients are added in a declarative manner with YAML configs.
- Author email templates in Pug.
- Includes a basic CSS reset for email clients.
- Built-in support for Google™ reCAPTCHA v3.
- Relatively small dependency footprint.

### Getting started

1. Clone or fork this repository
2. Remove the `.sample` portions of the configuration files in the `settings` directory and amend them to suit your setup
3. This service requires Node `≥14`. Run `nvm use` in the project root if you use `nvm`
4. Run `yarn install` to install the required dependencies
5. For local development and testing your configuration, run `yarn develop` and visit `localhost:3030`
6. You can test your email configuration with by running a local copy of Platframe with an active `Form` instance

### Deployment

1. Upload or clone your customized service to a Node server running at least `v14`
2. Configure your particular server to deal with any proxying or SSL certification, etc
3. Run `cd path/to/your/service-forms/ && yarn install && yarn deploy`

#### Notes

Note that while it is being used in production, this service is still in an early stage of development. 

Contributions are welcomed and encouraged &mdash; irrespective of experience.
