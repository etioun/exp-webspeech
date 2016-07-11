// Filename: app.js
define([
  'jquery',
  'speechSynth',
  'speechRecognition',
  'speechRecorder',
  'views/userConsole',
  'slideLogic/default'
], function($, SpeechSynth,SpeechRecognition, SpeechRecorder, UserConsoleView, DefaultLogic){

  var lastEntered = null;

  var toBeReloaded = false;

  var initialize = function(){

    $(document).on('impress:stepenter', function (event) {

      if (toBeReloaded) {
        window.location.reload(true);
        return;
      }

      var target = $(event.target);
      lastEntered = target;

      //Call init slide
      DefaultLogic.enterSlide(event);

      //Perform slide logic

      if (target[0].id == "index") {
        UserConsoleView.showRestart();
      } else if (target[0].id == "first"){
        if (!('webkitSpeechRecognition' in window)) {
          UserConsoleView.showSpeechRecognitionNotSupported();
        }

        if (!('speechSynthesis' in window)) {
          UserConsoleView.showSpeechSynthesisNotSupported();
        };
      }
      DefaultLogic.perform(target, function (next){
        if ($('#'+next).length === 0) {
          nextStep(target);
        } else {
          if (target == lastEntered) {
            impress().goto($('#'+next)[0]);
          }
        }
      });

    });

    $(document).on('impress:stepleave', function (event) {
      //call terminate slide
      DefaultLogic.leaveSlide(event);
    });

    SpeechSynth.init();
    SpeechRecognition.init();

    var ua = navigator.userAgent.toLowerCase();
    if ( ua.search(/(android)/) === -1 ) {
      SpeechRecorder.init();
    }
    // SpeechRecorder.init();

    UserConsoleView.on('reloadSlide', function() {
      // window.location.reload();
      impress().goto(lastEntered[0]);
    })

    UserConsoleView.on('restart', function() {
      impress().goto($('#first')[0]);
      toBeReloaded = true;
    })

    UserConsoleView.on('playAnswers', function() {
      SpeechSynth.cancel();

      var stuffToSay = lastEntered.find('.stt');

      if (stuffToSay.length == 1) {
        var v = lastEntered.find('.stt')[0];
        if (v.dataset.say) {
          SpeechSynth.say(v.dataset.say);
        } else {
          SpeechSynth.say(v.innerHTML);
        }
      } else {
        $.each(lastEntered.find('.stt'),function(i, v){

          SpeechSynth.say("Réponse "+ (i+1) + " : ");

          if (v.dataset.say) {
            SpeechSynth.say(v.dataset.say);
          } else {
            SpeechSynth.say(v.innerHTML);
          }
        });
      }
    })

    impress().init();
    $('#impress').show();

    document.consoleAccess = {
      mockSpeech: SpeechRecognition.mockSpeech,
      noTTS : false
    };
  };

  var nextStep = function(currentStep) {
    if (currentStep == lastEntered) {
      impress().next();
    }
  }

  return {
    initialize: initialize
  };
});
