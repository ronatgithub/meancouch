# meancouch

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.2.0.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.

# couchdb validate_doc_update

function(newDoc, oldDoc, userCtx) {
    if (newDoc._deleted === true) {
        // allow deletes by admins and matching users
        // without checking the other fields
        if ((userCtx.roles.indexOf('_admin') !== -1) ||
            (userCtx.name == oldDoc.user)) {
            return;
        } else {
            throw({forbidden: 'Only Admins may delete other user docs. Nothing was deleted.'});
        }
    };

  if (userCtx.roles.indexOf('_admin') === -1 && newDoc.user !== userCtx.name) {
    throw({forbidden : "Only the user himself or an Admin can modify this documents."});
  }
}
