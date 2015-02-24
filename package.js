Package.describe({
  name: 'lai:document-methods',
  version: '0.1.9',
  // Brief, one-line summary of the package.
  summary: 'Extend your documents with helpful methods.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rclai/meteor-document-methods.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('0.9.3');
  
  api.use([
    // Hopefully, MDG decides to switch to Lodash.. THEY BETTER!
    'underscore',
    'mongo',
    'lai:collection-extensions@0.1.1',
    'dburles:collection-helpers@1.0.2'
  ]);

  api.addFiles([
    'document-methods.js'
  ]);
});

Package.onTest(function(api) {
  api.use([
    'accounts-base',
    'tinytest',
    'tracker',
    'mongo',
    'underscore',
    'matb33:collection-hooks@0.7.9',
    'aldeed:collection2@2.3.2',
    'ongoworks:security@1.0.1',
    'cfs:standard-packages@0.5.3',
    'dburles:mongo-collection-instances@0.3.1',
    'cfs:gridfs@0.0.27'
  ]);
  api.use('lai:document-methods');
  api.addFiles([
    'tests/functions.js',
    'tests/tests.js'
  ]);
});
