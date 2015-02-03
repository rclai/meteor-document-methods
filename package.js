Package.describe({
  name: 'lai:document-methods',
  version: '0.0.5',
  // Brief, one-line summary of the package.
  summary: 'Extend your documents with helpful methods.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rclai/meteor-document-methods.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('0.9.1');

  api.use([
    // Hopefully, MDG decides to switch to Lodash.. THEY BETTER!
    'underscore',
    'mongo',
    'dburles:collection-helpers@1.0.2'
  ]);

  api.addFiles('document-methods.js');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'tracker',
    'mongo',
    'underscore'
  ]);
  api.use('lai:document-methods');
  api.addFiles('document-methods-tests.js');
});
