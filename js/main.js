// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "jqueryui" : { "deps" :['jquery'] },
        "p5.sound" : { "deps" :['p5'] }
  },
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    backbone: '../bower_components/backbone/backbone',
    underscore: '../bower_components/underscore/underscore',
    impress: 'customImpress/js/impress',
    jqueryui: '../bower_components/jquery-ui/jquery-ui',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
    p5: './p5/p5',
    "p5.sound": './p5/p5.sound',
    }

});

require([
  // Load our app module and pass it to our definition function
  'app','jqueryui','bootstrap','impress', 'p5.sound'
], function( App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});
