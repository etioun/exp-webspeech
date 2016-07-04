// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'speechRecognition',
  'speechSynth',
  'dialogReader',
  'views/dialog',
], function($, _, Backbone, SpeechRecognition, SpeechSynth, DialogReader, DialogView){

  var initialize = function(){

    // Pass in our Router module and call it's initialize function
    //Router.initialize();
    if (!('webkitSpeechRecognition' in window) ) {
        $("body").append("<p>web speech API not available, please use chrome browser</p>");
    } else {

      SpeechRecognition.init({
        "lang": "fr-fr",
        onResult: function(result) {
          console.log(result.transcript );
          var transcript = $.trim(result.transcript);
          var idCommand = getCommand(transcript);
          if (idCommand) {
            actives = Controls.active();
            actives.forEach(function (control) { control.set('active', false); });
            activated = Controls.where({code: idCommand});
            activated.forEach(function (control) { control.set('active', true); });
          }
        }});

      SpeechSynth.init({"lang": "fr-fr"});

      DialogView = new DialogView();
      DialogView.render();

      DialogReader.on('nextSentence', function (Sentence) {
        if (Sentence.get('type') == "DN") {
          if (Sentence.say) {
            SpeechSynth.say(Sentence.get('say'));
          } else {
            SpeechSynth.say(Sentence.get('body'));
          }

          SpeechSynth.waitTillSilent(function () { DialogReader.nextSentence(); } );

        } else if (Sentence.get('type') == "DS") {

          SpeechSynth.waitTillSilent(function () {

            SpeechRecognition.start();

            SpeechRecognition.onResult(function(result) {
              console.log(result.transcript );
              //Check match
              var isMatch = Sentence.get('activation').some( function (e) {
                return $.trim(result.transcript) == e;
              });

              if (isMatch)
              {
                SpeechRecognition.stop(function () {
                  Sentence.set('done', true);
                  DialogReader.nextSentence();
                });
              }
            })
          })
        }
      })

      $.getJSON('data/dialog1FR.json', function (data) {
        DialogReader.init({ "dialog" : data});
        DialogReader.nextSentence();
      });
    }
  };

  return {
    initialize: initialize
  };
});
