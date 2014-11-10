exports.config =
  conventions:
    assets: /^app\//
  paths:
    public: 'public'
  files:
    javascripts:
      joinTo:
        'vendor.js': /^bower_components/
        'js/app.js': /^app\/scripts/
    stylesheets:
      joinTo:
        'css/app.css': /^app\/styles/
