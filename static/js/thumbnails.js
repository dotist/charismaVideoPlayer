/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  var $wr = $('#scene-elements');

  // Init names from data and insert into wrapper.
  // Fade in names.
  initTextEl(d.n, $wr);

  // if (condition == 'true'){
  //   function1(someVariable, function() {
  //     function2(someOtherVariable);
  //   });
  // }
  // else {
  //     doThis(someVariable);
  // }


  sPreEtransition();
  sEtransition();
  // sceneElementsFadeTransition();

  // Init titles from data and insert into wrapper.
  // Fade in + images with zoom effect.
  initTextEl(d.e, $wr);

  $('body').imagesLoaded( function() {
    initImages(d.e, $wr);

    // Zoom in elements
    sceneElementsZoomTransition();

    // initOrbits();

  });

});


/**
 * Init Names
 */
function initTextEl(n, $wr) {
  var append = '<div class="scene-element"></div>';
  if (n.hasOwnProperty('items')) {
    for (var i = 0; i < n.items.length; i++) {
      var d = n.items[i];
      if (d.type == 'text') {
        $wr.prepend(append);
        var d = n.items[i];
        var $el = $wr.children().first();
        $el.sceneElAttr(d);
        var text = '<div class="text">' + d.name + '</div>';
        $el.append(text);
        $el.css(d.styles);
        $el.placeIn3dTargetZone(d);
        css = thumbnailTextStyles(d);
        css.transform += ' scale(' + $el.attr('scale') + ')';
        $el.children().css(css);
      }
    }
  }
}

/**
 * Init Images
 */
function initImages(n, $wr) {
  var append = '<div class="scene-element"></div>';
  if (n.hasOwnProperty('items')) {
    for (var i = 0; i < n.items.length; i++) {
      var d = n.items[i];
      if (d.type == 'image') {
        $wr.prepend(append);
        var $el = $wr.children().first();
        $el.sceneElAttr(d);
        var css = {};
        var tSize = thumbnailSize();
        css = thumbnailImageStyles(d, tSize, n.releaseId);
        var overlayPath = '/releases/' + n.releaseId + '/' + d.name;
        var img = '<img class="overlay-gif" src="' + overlayPath + '.gif"></img>';
        $el.append(img);
        $el.css(Object.assign({}, css, d.styles));
        $el.placeIn3dTargetZone(d);
      }
    }
  }
}

/**
 * Scene Element default attributes.
 */
$.fn.sceneElAttr = function(d) {
  var $el = this;
  $el.attr('id', d.id)
    .attr('name', d.name)
    .attr('sIndex', i)
    .attr('target-zone', d.targetZone)
    .attr('type', d.type)
    .attr('vidEn', d.videoId)
    .attr('vidDe', d.videoIdGerm)
    .addClass(d.type)
    .addClass(d.classes);
  return this;
};

/**
 * Scene Element default attributes.
 */
$.fn.placeIn3dTargetZone = function(d) {
  var $el = this;
  var targetZone = d.targetZone;
  var $targetZone = $('[segment="' + targetZone + '"]').first();
  var zoneMax = $('[segment]').last().attr('segment');
  $el.box = {
    w: $targetZone.outerWidth(),
    h: $targetZone.outerHeight(),
    l: $targetZone.offset().left,
    t: $targetZone.offset().top,
  };
  // Set scale basedon topZone
  $el.attr('target-zone', targetZone);
  var scale = (zoneMax - targetZone) / zoneMax;
  var p = {
    s: scale,
    t: $el.box.t,
    l: $el.box.l,
  };
  // Init Place element within the bounds of its parent zone top left,
  // on an edge. Use bounds b/c scaling doesn't change outerH/W.
  // If bounds are outside window height, place at wH.
  // @TODO - this? Set styles with scale now b/c we need the new dimentions.
  // Custom placement
  var styles = {};
  var orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
  var decFactor = 100;
  var x = parseInt(d[orientation].x) / decFactor;
  var y = parseInt(d[orientation].y) / decFactor;

  var stylesTop = Math.round($el.box.t + ($el.box.h * y));
  var stylesLeft = Math.round($el.box.l + ($el.box.w * x));
  // styles.transform = 'translate(' + stylesLeft + 'px,' + stylesTop + 'px)';
  styles.transform = 'scale(' + (p.s) + ')';
  // if ($el.attr('type') == 'text') {
  //  }
  $el.attr('scale', p.s)
     .attr('t', stylesTop)
     .attr('l', stylesLeft);

  $el.css(styles);
  return this;
};

/**
 *
 */
function sPreEtransition() {
  var $s = $('.scene-element');
  $s.each(function(i){
    var $e = $(this);
    var $w = $('#grid-svg');
    var x1 = $(window).width() / 2;
    var y1 = $(window).height() / 2 - ($(window).height() / 8);
    $e.css({
      transform: 'translate(' + x1 + 'px, ' + y1 + 'px)',
    });
  });
}
/**
 *
 */
function sEtransition() {
  var $s = $('.scene-element');
  $s.each(function(i){
    var $e = $(this);
    var $w = $('#grid-svg');
    var x1 = $(window).width() / 2;
    var y1 = $(window).height() / 2 - ($(window).height() / 8);
    var x2 = $e.attr('l');
    var y2 = $e.attr('t');
    setTimeout(function(){
      $e.velocity({
        translateX: x2,
        translateY: y2,
        opacity: 1,
      });
      // bounceInPlace($el, numberBetween(100,150));
    }, 300 * i);
  });
}

/**
 * Fade in Names
 */
function sceneElementsFadeTransition() {
  var $fadeElements = $('.scene_element--name');
  $fadeElements.each(function(i){
    var $el = $(this);
    setTimeout(function(){
      $el.addClass('se-visible');
      // bounceInPlace($el, numberBetween(100,150));
    }, 300 * i);
  });
}

/**
 *
 */
function sceneElementsZoomTransition() {
  var $zoomElements = $('.scene-element__zoom-in');
  setTimeout(function(){
    $zoomElements.each(function(i){
      var $e = $(this);
      setTimeout(function(){
        // $e.css({
        //   transform: 'scale(' + ($e.attr('scale')) + ')'
        // });
        $e.addClass('se-visible');
        $e.removeClass('scene-element__zoom-in');
        if ($e.hasClass('text')) {
          setTimeout(function(){
            bounceInPlace($e, numberBetween(100,150));
          }, 600);
        }
        if ($e.hasClass('image')) {
          setTimeout(function(){
            var tz = $e.attr('target-zone');
            var $tz = $('[segment="' + parseInt(tz) + '"]');
            var cur1 = $e.offset().left;
            var pos1 = $tz.offset().left + $tz.width();
            var pos2 = $tz.offset().left;

            function bounceWallInit($e, $tz, i) {
              // Calculate random point on $tz rectangle perimeter.
              var s = numberBetween(1, 4);
              var o = s%2 == 0 ? 'y' : 'x';
              var pos = numberBetween(1, $tz.width());
              var bounds = $e[0].getBoundingClientRect();

              var x = $tz.width() - (bounds.width / 2 * i);
              var y = $tz.height() - (bounds.height / 2 * i);

              var properties = {
                translateX: numberBetween(0, $tz.width()) - $tz.offset().left,
                translateY: numberBetween(0, $tz.width()) - $tz.offset().top,
                scale: [$e.attr('scale'), $e.attr('scale')]
              };
              var dur = 7000;
              $e.velocity(
                properties
                , {
                easing: 'linear',
                duration: dur,
                complete: function(){
                  bounceWallInit($e, $tz, i);
                }
              });
            }
            setTimeout(function(){
              bounceWallInit($e, $tz, 1);
            }, 200 * i);

          }, 1000);
        }
      }, 50 * i);
    });
  }, 700);
}

/**
 *
 */
function bounceInPlace($e, dist) {
  // Up.
  $e.velocity({
    translateY: dist * -1,
  }, {
    duration: numberBetween(200,500),
  }, "easeOutCirc");
  // Down.
  $e.velocity({
    translateY: dist,
  }, {
    duration: numberBetween(4000, 5000),
    complete: function() {
      bounceInPlace($e, dist);
    }
  }, "easeInCirc");
}


/**
 * Init orbits.
 */
function initOrbits() {
  for (var i = 0; i < sE.length; i++) {
    var $el = $('#' + sE[i].name);

    var targetZone = sE[i].targetZone;

    var speed = 10;
    // var targetZoneId = (window.innerWidth < 600) ? '#scene-elements' : '#grid-' + targetZone;
    var targetZoneId = '#grid-' + targetZone;
    if ($el.attr('type') == 'image') {
      $el.bounce('start', {
        'minSpeed'	: speed,
        'maxSpeed'	: speed,
        'zone'		: targetZoneId
      });
      $el.hover(function() {
        $(this).each(function() {
          $(this).bounce('stop');
        });
      }, function() {
        $(this).each(function() {
          $(this).bounce('start', {
            'minSpeed'	: speed,
            'maxSpeed'	: speed,
            'zone'		: targetZoneId
          });
        });
      });

    }
  }
  $('.master-controls .close').click(function(){
    for (var i = 0; i < sE.length; i++) {
      var $el = $('#' + sE[i].name);
      var targetZone = sE[i].targetZone;
      var speed = 10;
      var targetZoneId = (window.innerWidth < 600) ? '#scene-elements' : '#grid-' + targetZone;
      if ($el.attr('type') == 'image') {
        $el.bounce('start', {
          'minSpeed'	: speed,
          'maxSpeed'	: speed,
          'zone'		: targetZoneId
        });
      }
    }
  });
}

function thumbnailSize() {
  var t = {
    w: '200px', h: '150px'
  };
  if (window.innerWidth > 600) {
    var t = {
      w: '200px', h: '150px'
    };
  }
  if (window.innerWidth > 800) {
    var t = {
      w: '290px', h: '220px'
    };
  }
  return t;
}

function thumbnailImageStyles(d, tSize, id) {
  return {
    'background-image':'url("/releases/' + id + '/' + d.name + '.jpg")',
    'width': tSize.w,
    'height': tSize.h,
    'transform' : 'translateY(-50%)',
  };
}

function thumbnailTextStyles(d, tSize) {
  var orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  return {
    'left': 0,
    'top': 0,
    'z-index': 1,
    'transform' : d[orientation].rotate
  };
}


/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
