/*!
 * jQuery Final Countdown
 *
 * @author Pragmatic Mates, http://pragmaticmates.com
 * @version 1.1.1
 * @license GPL 2
 * @link https://github.com/PragmaticMates/jquery-final-countdown
 */

(function ($) {
  var settings;
  var timer;

  var circleSeconds;
  var circleMinutes;
  var circleHours;
  var circleDays;
  var circleMonths;
  var circleYears;

  var layerSeconds;
  var layerMinutes;
  var layerHours;
  var layerDays;
  var layerMonths;
  var layerYears;

  var element;
  var callbackFunction;

  $.fn.final_countdown = function(options, callback) {
      element = $(this);
      //console.log($(this).css('display'));
      // Element is not visibile
      if ( ! element.is(':visible') ) {
          return;
      }

      var defaults = $.extend({
          start: undefined,
          end: undefined,
          now: undefined,
          selectors: {
              value_seconds: '.clock-seconds .val',
              type_seconds: '.clock-seconds .type-seconds',
              canvas_seconds: 'canvas-seconds',
              value_minutes: '.clock-minutes .val',
              type_minutes: '.clock-minutes .type-minutes',
              canvas_minutes: 'canvas-minutes',
              value_hours: '.clock-hours .val',
              type_hours: '.clock-hours .type-hours',
              canvas_hours: 'canvas-hours',
              value_days: '.clock-days .val',
              type_days: '.clock-days .type-days',
              canvas_days: 'canvas-days',
              value_months: '.clock-months .val',
              type_months: '.clock-months .type-months',
              canvas_months: 'canvas-months',
              value_years: '.clock-years .val',
              type_years: '.clock-years .type-years',
              canvas_years: 'canvas-years'
          },
          seconds: {
              borderColor: '#01e2f9',
              borderWidth: '4'
          },
          minutes: {
              borderColor: '#01e2f9',
              borderWidth: '4'
          },
          hours: {
              borderColor: '#01e2f9',
              borderWidth: '4'
          },
          days: {
              borderColor: '#01e2f9',
              borderWidth: '4'
          },
          months: {
              borderColor: '#01e2f9',
              borderWidth: '4'
          },
          years: {
              borderColor: '#01e2f9',
              borderWidth: '4'
          }
      }, options);

      settings = $.extend({}, defaults, options);

      if (settings.start === undefined) {
          settings.start = element.data('start');
      }

      if (settings.end === undefined) {
          settings.end = element.data('end');
      }

      if (settings.now === undefined) {
          settings.now = element.data('now');
      }

      if (element.data('border-color')) {
          settings.seconds.borderColor = settings.minutes.borderColor = settings.hours.borderColor = settings.days.borderColor = element.data('border-color');
      }

      if (settings.now < settings.start ) {
          settings.start = settings.now;
          settings.end = settings.now;
      }

      if (settings.now > settings.end) {
          settings.start = settings.now;
          settings.end = settings.now;
      }

      if (typeof callback == 'function') { // make sure the callback is a function
          callbackFunction = callback;
      }

      responsive();
      dispatchTimer();
      prepareCounters();
      startCounters();
  };

  function responsive() {
      $(window).on('load', updateCircles);

      $(window).on('redraw', function() {
          switched = false;
          updateCircles();
      });
      $(window).on('resize', updateCircles);
  }
  function updateCircles() {
      layerSeconds.draw();
      layerMinutes.draw();
      layerHours.draw();
      layerDays.draw();
      layerMonths.draw();
      layerYears.draw();
  }

  function convertToDeg(degree) {
      return (Math.PI/180)*degree - (Math.PI/180)*90
  }

  function dispatchTimer() {
      // timer = {
      //     total_years:   Math.abs((settings.end.year() - settings.now.year())),
      //     years:   Math.abs((settings.end.year() - settings.now.year())),
      //     months:  (settings.end.month() != 0) ? 12 - Math.abs((settings.end.month() - settings.now.month())) : 12 - Math.abs((12 - settings.now.month())),
      //     days:    (settings.end.day() != 0) ? moment().daysInMonth() - Math.abs((settings.end.day() - settings.now.day())) : moment().daysInMonth() - Math.abs((moment().day() - settings.now.day())),
      //     hours:   (settings.end.hour() != 0) ? 24 - Math.abs((settings.end.hour() - settings.now.hour())) : 24 - Math.abs((24 - settings.now.hour())),
      //     minutes: (settings.end.minute() != 0) ? 60 - Math.abs((settings.end.minute() - settings.now.minute())) : 60 - Math.abs((60 - settings.now.minute())),
      //     seconds: (settings.end.second() != 0) ? 60 - Math.abs((settings.end.second() - settings.now.second())) : 60 - Math.abs((60 - settings.now.second()))
      // };
      timer = {
          total_years: moment.duration(settings.end.diff(settings.start)).years(),
          years:   moment.duration(settings.end.diff(settings.start)).years() - moment.duration(settings.end.diff(settings.now)).years(),
          months:  12 - moment.duration(settings.end.diff(settings.now)).months(),
          // days:    moment().daysInMonth() - (moment.duration(settings.end.diff(settings.now)).days() - (moment().daysInMonth() - settings.now.date())),
          days:    moment().daysInMonth() - moment.duration(settings.end.diff(settings.now)).days(),
          hours:   24 - moment.duration(settings.end.diff(settings.now)).hours(),
          minutes: 60 - moment.duration(settings.end.diff(settings.now)).minutes(),
          seconds: 60 - moment.duration(settings.end.diff(settings.now)).seconds()
      };

  }



  function prepareCounters() {
      // Seconds
      var seconds_width = $('#' + settings.selectors.canvas_seconds).width();
      var secondsStage = new Kinetic.Stage({
          container: settings.selectors.canvas_seconds,
          width: seconds_width,
          height: seconds_width
      });
      var shadow_one = new Kinetic.Shape({
          lineCap: "round",
          stroke: 'rgba(1, 231, 254, 0.45)',
          strokeWidth: settings.seconds.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });
      circleSeconds = new Kinetic.Shape({
          drawFunc: function(context) {
              shadow_one.attrs.stroke = 'rgba(1, 231, 254, 0.45)';
              var seconds_width = $('#' + settings.selectors.canvas_seconds).width();
              var radius = seconds_width / 2 - settings.seconds.borderWidth+1;
              var x = seconds_width / 2;
              var y = seconds_width / 2;
              context.beginPath();
              context.arc(x, y, radius, convertToDeg((timer.seconds-1) * 360 / 60), convertToDeg(timer.seconds * 360 / 60));
              context.fillStrokeShape(this);
              var shadowOpasity = 0.47;
              for(var i = 1; i < timer.seconds; i++){
                  context.beginPath();
                  context.arc(x, y, radius, convertToDeg((timer.seconds-(i+1)) * 360 / 60), convertToDeg((timer.seconds-i) * 360 / 60));
                  context.fillStrokeShape(shadow_one);
                  shadow_one.attrs.stroke = "rgba(1, 231, 254, "+ parseFloat((shadowOpasity-(0.1/i))) +")";
                  shadowOpasity-=(0.1/i);
              }
              var seconds = 60-timer.seconds;
              $(settings.selectors.value_seconds).html(seconds);
              $(settings.selectors.type_seconds).html(declOfNum(seconds, ['Секунда', 'Секунды', 'Секунд']));
          },
          lineCap: "round",
          stroke: settings.seconds.borderColor,
          strokeWidth: settings.seconds.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });

      layerSeconds = new Kinetic.Layer();
      layerSeconds.add(circleSeconds);
      secondsStage.add(layerSeconds);

      // Minutes
      var minutes_width = $('#' + settings.selectors.canvas_minutes).width();
      var minutesStage = new Kinetic.Stage({
          container: settings.selectors.canvas_minutes,
          width: minutes_width,
          height: minutes_width
      });
      circleMinutes = new Kinetic.Shape({
          drawFunc: function(context) {
              shadow_one.attrs.stroke = 'rgba(1, 231, 254, 0.45)';
              var minutes_width = $('#' + settings.selectors.canvas_minutes).width();
              var radius = minutes_width / 2 - settings.minutes.borderWidth+1;
              var x = minutes_width / 2;
              var y = minutes_width / 2;
              context.beginPath();
              context.arc(x, y, radius, convertToDeg((timer.minutes-1) * 360 / 60), convertToDeg(timer.minutes * 360 / 60));
              context.fillStrokeShape(this);
              var shadowOpasity = 0.45;
              for(var i = 1; i < timer.minutes; i++){
                  context.beginPath();
                  context.arc(x, y, radius, convertToDeg((timer.minutes-(i+1)) * 360 / 60), convertToDeg((timer.minutes-i) * 360 / 60));
                  context.fillStrokeShape(shadow_one);
                  shadow_one.attrs.stroke = "rgba(1, 231, 254, "+ parseFloat((shadowOpasity-(0.1/i))) +")";
                  shadowOpasity-=(0.1/i);
              }
              var minutes = 60-timer.minutes;
              $(settings.selectors.value_minutes).html(minutes);
              $(settings.selectors.type_minutes).html(declOfNum(minutes, ['Минута', 'Минуты', 'Минут']));
          },
          lineCap: "round",
          stroke: settings.minutes.borderColor,
          strokeWidth: settings.minutes.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });

      layerMinutes = new Kinetic.Layer();
      layerMinutes.add(circleMinutes);
      minutesStage.add(layerMinutes);

      // Hours
      var hours_width = $('#' + settings.selectors.canvas_hours).width();
      var hoursStage = new Kinetic.Stage({
          container: settings.selectors.canvas_hours,
          width: hours_width,
          height: hours_width
      });
      circleHours = new Kinetic.Shape({
          drawFunc: function(context) {
              shadow_one.attrs.stroke = 'rgba(1, 231, 254, 0.45)';
              var hours_width = $('#' + settings.selectors.canvas_hours).width();
              var radius = hours_width / 2 - settings.hours.borderWidth+1;
              var x = hours_width / 2;
              var y = hours_width / 2;
              var k = 360 / 96;
              context.beginPath();
              context.arc(x, y, radius, convertToDeg((timer.hours*4-4) * k), convertToDeg(timer.hours*4 * k));
              context.fillStrokeShape(this);
              var shadowOpasity = 0.37;
              var time = timer.hours*4;
              for(var i = 1; i < timer.hours; i++){
                  time = timer.hours*4 - i*4;
                  for (var j = 0; j < 4; j++) {
                      context.beginPath();
                      context.arc(x, y, radius, convertToDeg((time - (j + 1)) * k), convertToDeg((time - j) * k));
                      context.fillStrokeShape(shadow_one);
                  }

                  shadow_one.attrs.stroke = "rgba(1, 231, 254, " + parseFloat((shadowOpasity - (0.1 / i))) + ")";
                  shadowOpasity -= (0.1 / i);
              }
              var hours = 24-timer.hours;
              $(settings.selectors.value_hours).html(hours);
              $(settings.selectors.type_hours).html(declOfNum(hours, ['Час', 'Часа', 'Часов']));
          },
          lineCap: "round",
          stroke: settings.hours.borderColor,
          strokeWidth: settings.hours.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });

      layerHours = new Kinetic.Layer();
      layerHours.add(circleHours);
      hoursStage.add(layerHours);

      // Days
      var days_width = $('#' + settings.selectors.canvas_days).width();
      var daysStage = new Kinetic.Stage({
          container: settings.selectors.canvas_days,
          width: days_width,
          height: days_width
      });
      circleDays = new Kinetic.Shape({
          drawFunc: function(context) {
              shadow_one.attrs.stroke = 'rgba(1, 231, 254, 0.45)';
              var days_width = $('#' + settings.selectors.canvas_days).width();
              var radius = days_width/2 - settings.days.borderWidth+1;
              var x = days_width / 2;
              var y = days_width / 2;
              var k = 360 / (moment().daysInMonth()*4);
              context.beginPath();
              context.arc(x, y, radius, convertToDeg((timer.days*4-4) * k), convertToDeg(timer.days*4 * k));
              context.fillStrokeShape(this);
              var shadowOpasity = 0.4;
              var time = timer.days*4;
              for(var i = 1; i < timer.days; i++){
                  time = timer.days*4 - i*4;
                  for (var j = 0; j < 4; j++) {
                      context.beginPath();
                      context.arc(x, y, radius, convertToDeg((time - (j + 1)) * k), convertToDeg((time - j) * k));
                      context.fillStrokeShape(shadow_one);
                  }

                  shadow_one.attrs.stroke = "rgba(1, 231, 254, " + parseFloat((shadowOpasity - (0.1 / i))) + ")";
                  shadowOpasity -= (0.1 / i);
              }
              var days = moment().daysInMonth() - timer.days;
              $(settings.selectors.value_days).html(days);
              $(settings.selectors.type_days).html(declOfNum(days, ['День', 'Дня', 'Дней']));
          },
          lineCap: "round",
          stroke: settings.days.borderColor,
          strokeWidth: settings.days.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });

      layerDays = new Kinetic.Layer();
      layerDays.add(circleDays);
      daysStage.add(layerDays);

      // Month
      var months_width = $('#' + settings.selectors.canvas_months).width();
      var monthsStage = new Kinetic.Stage({
          container: settings.selectors.canvas_months,
          width: months_width,
          height: months_width
      });

      circleMonths = new Kinetic.Shape({
          drawFunc: function(context) {
              shadow_one.attrs.stroke = 'rgba(1, 231, 254, 0.45)';
              var months_width = $('#' + settings.selectors.canvas_months).width();
              var radius = months_width/2 - settings.months.borderWidth+1;
              var x = months_width / 2;
              var y = months_width / 2;
              var k = 360 / (12*8);
              context.beginPath();
              context.arc(x, y, radius, convertToDeg(8*(timer.months-1) * k), convertToDeg(8*timer.months * k));
              context.fillStrokeShape(this);
              var shadowOpasity = 0.32;
              var time = timer.months*8;
              for(var i = 1; i < timer.months; i++){
                  time = timer.months*8 - i*8;
                  for (var j = 0; j < 8; j++) {
                      context.beginPath();
                      context.arc(x, y, radius, convertToDeg((time - (j + 1)) * k), convertToDeg((time - j) * k));
                      context.fillStrokeShape(shadow_one);
                  }
                  shadow_one.attrs.stroke = "rgba(1, 231, 254, " + parseFloat((shadowOpasity - (0.1 / i))) + ")";
                  shadowOpasity -= (0.1 / i);
              }
              var months =  12-timer.months;
              $(settings.selectors.value_months).html(months);
              $(settings.selectors.type_months).html(declOfNum(months, ['Месяц', 'Месяца', 'Месяцев']));
          },
          lineCap: "round",
          stroke: settings.months.borderColor,
          strokeWidth: settings.months.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });

      layerMonths = new Kinetic.Layer();
      layerMonths.add(circleMonths);
      monthsStage.add(layerMonths);

      // Years
      var years_width = $('#' + settings.selectors.canvas_years).width();
      var yearsStage = new Kinetic.Stage({
          container: settings.selectors.canvas_years,
          width: years_width,
          height: years_width
      });

      circleYears = new Kinetic.Shape({
          drawFunc: function(context) {
              shadow_one.attrs.stroke = 'rgba(1, 231, 254, 0.45)';
              var years_width = $('#' + settings.selectors.canvas_years).width();
              var radius = years_width/2 - settings.years.borderWidth+1;
              var x = years_width / 2;
              var y = years_width / 2;
              var k = 360 / timer.total_years;
              context.beginPath();
              context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.years * k));
              context.fillStrokeShape(this);
              var shadowOpasity = 0.47;
              for(var i = 1; i < timer.years; i++){
                  context.beginPath();
                  context.arc(x, y, radius, convertToDeg((timer.years-(i+1)) * k), convertToDeg((timer.years-i) * k));
                  context.fillStrokeShape(shadow_one);
                  shadow_one.attrs.stroke = "rgba(1, 231, 254, "+ parseFloat((shadowOpasity-(0.1/i))) +")";
                  shadowOpasity-=(0.1/i);
              }
              var years = timer.total_years - timer.years;
              $(settings.selectors.value_years).html(years);
              $(settings.selectors.type_years).html(declOfNum(years, ['Год', 'Года', 'Лет']));
          },
          lineCap: "round",
          stroke: settings.years.borderColor,
          strokeWidth: settings.years.borderWidth,
          shadowOffset: '0',
          shadowColor: '#00e8ff',
          shadowBlur: '2'
      });

      layerYears = new Kinetic.Layer();
      layerYears.add(circleYears);
      yearsStage.add(layerYears);
  }

  function startCounters() {
      var interval = setInterval( function() {
          if (timer.seconds > 59 ) {
              if (timer.minutes == 60 && timer.hours == 24 && timer.days == moment().daysInMonth() && timer.months == 12 && timer.years == 0) {
                clearInterval(interval);
                  if (callbackFunction !== undefined) {
                      callbackFunction.call(this); // brings the scope to the callback
                  }
                  return;
              }
              timer.seconds = 1;
              if (timer.minutes > 59) {
                  timer.minutes = 1;
                  layerMinutes.draw();
                  if (timer.hours > 23) {
                      timer.hours = 1;
                      if (timer.days > (moment().daysInMonth()-1)) {
                          timer.days = 1;
                          if (timer.months > 11) {
                              timer.months = 1;
                              if (timer.years > timer.total_years) {
                                  timer.months = timer.total_years;
                              } else{
                                  timer.years++;
                              }
                              layerYears.draw();
                          } else {
                              timer.months++;
                          }
                          layerMonths.draw();
                      } else {
                          timer.days++;
                      }
                      layerDays.draw();
                  } else {
                      timer.hours++;
                  }
                  layerHours.draw()
              } else {
                  timer.minutes++;
              }

              layerMinutes.draw();
          } else {
              timer.seconds++;
          }
          layerSeconds.draw();
      }, 1000);
  }
})(jQuery);