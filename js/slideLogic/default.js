define([
'jquery',
'views/userConsole',
'speechSynth',
'speechRecognition',
'speechRecorder'
], function($, UserConsoleView, SpeechSynth, SpeechRecognition, SpeechRecorder){

  var perform = function (target, callbackDone) {

    var speaking = false;
    var lastToSpeak = null;


    $.each($(target[0]).find('.tts'),function(i, v){
      if (document.consoleAccess.noTTS) {
        return;
      }

      if (v.dataset.say) {
        SpeechSynth.say(v.dataset.say);
      }else {
        SpeechSynth.say(v.innerHTML);
      }
      speaking = true;
      lastToSpeak = v;
    });

    SpeechSynth.waitTillSilent(function (){
      if (lastToSpeak && lastToSpeak.dataset.next) {
          _finishWithDelay(target, lastToSpeak.dataset.next,callbackDone);
      } else {

        if ($(target[0]).find('.stt').length > 0) {
          var activationMap = [];
          var allActivations = [];

          $.each($(target[0]).find('.stt'),function(ielt, elt){
            var activations = elt.dataset.stt.split('|');
            $.each(activations, function(i,v) {
              activationMap[v] = elt;
            })
            allActivations = allActivations.concat(activations);
          });

          SpeechRecognition.once('start', function () { UserConsoleView.showSayIt(); });
          SpeechRecognition.expect(allActivations, function(activation) {
              UserConsoleView.showDone();
              setTimeout(function (){
                var elt = activationMap[activation];
                callbackDone(elt.dataset.next);
              }, 1000);
            },
            function (result) {
              if (result[0].confidence > 0.8) {
                UserConsoleView.showMistake(result[0].transcript);
              } else {
                UserConsoleView.showMistake();
              }
              $(target[0]).find('.stt').effect('shake');
            });
        }
        else {
          if  ($(target[0]).data('next')) {
            _finishWithDelay(target, $(target[0]).data('next'), callbackDone);
          }
        }
      }
    });

  }

  var _finishWithDelay = function(target, nextId, callbackDone) {
    var delay = $(target[0]).data('delay');
    if (delay) {
      setTimeout(function() {
          callbackDone(nextId);
      }, delay);
    } else {
      callbackDone(nextId);
    }
  }

  var leaveSlide = function(leaveEvent) {
    UserConsoleView.clear();
    SpeechRecognition.stop(function (){
      // UserConsoleView.clear();
    });
    SpeechSynth.cancel();
  }

  var enterSlide = function(enterEvent) {

      var target = $(enterEvent.enterEvent);
      var body = $(document.body);
      // body.removeClass(
      //   'white-bg gray-bg red-bg orange-bg green-bg purple-bg blue-bg');
      body.removeClass(function (i, className) {

        var toRemove = "";
        $.each(className.split(" "), function (i, v) {
          var endClass = "-bg";
          var exist = v.slice(-endClass.length) == endClass; // true
          if (exist) {
            toRemove += v + " ";
          };
        });
        return toRemove;
      });

      if (target.hasClass('white'))
        body.addClass('white-bg');
      else if (target.hasClass('gray'))
        body.addClass('gray-bg');
      else if (target.hasClass('red'))
        body.addClass('red-bg');
      else if (target.hasClass('orange'))
        body.addClass('orange-bg');
      else if (target.hasClass('green'))
        body.addClass('green-bg');
      else if (target.hasClass('purple'))
        body.addClass('purple-bg');
      else if (target.hasClass('blue'))
        body.addClass('blue-bg');


      SpeechRecognition.stop();
      SpeechSynth.cancel();
      SpeechRecorder.stop();
      UserConsoleView.clear();

  }

  return {
    perform : perform,
    leaveSlide : leaveSlide,
    enterSlide : enterSlide
  }
});
