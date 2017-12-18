/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  $('body').imagesLoaded( function() {
    var textElements = function() {
      var $wr = $('#scene-elements');
      initTextEl(d.e, $wr);
      initTextEl(d.n, $wr);
      sPreEtransition(sEtransition);
    };
    var imageElements = function(callback) {
      var $wr = $('#scene-elements');
      initImages(d.e, $wr);
      // sPreEtransition(sEtransition);
      callback();
    };
    imageElements(textElements);
    setTimeout(function(){
      initOrbits();
    },5000);
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
        var overlayPath = '/releases/' + n.releaseId + '/' + d.id;
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
  var styles = {
    // 'z-index': targetZone * -1
  };
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
var sPreEtransition = function(callback) {
  var $s = $('.scene-element');
  $s.each(function(i){
    if ($s.attr('state') == 'done') return;
    var $e = $(this);
    var x1 = ($(window).width() / 2) + ($e.width() / 2);
    var y1 = $(window).height() / 2 - ($(window).height() / 8);
    $e.css({
      transform: 'translate(' + x1 + 'px, ' + y1 + 'px) scale(0.01)',
    });
  });
  setTimeout(function(){
    callback();
  }, 300);
};
/**
 *
 */
var sEtransition = function() {
  var $s = $('.scene-element');
  $s.each(function(i){
    var $e = $(this);
    var x2 = $e.attr('l');
    var y2 = $e.attr('t');
    setTimeout(function(){
      // $e.css({
      //   'transform': 'translate(' + x2 + 'px, ' + y2 + 'px) scale(' + $e.attr('scale') + ')',
      //   'opacity': 1,
      // });
      $e.velocity({
        translateX: x2,
        translateY: y2,
        opacity: 1,
        scale : $e.attr('scale'),
        tween: 1000,
      },
      {
        progress: function(elements, complete, remaining, start, tweenValue) {
          // console.log((complete * 100) + "%");
          // console.log(remaining + "ms remaining!");
          // console.log("The current tween value is " + tweenValue);
        }
    });
      setTimeout(function(){
        switch ($e.attr('type')) {
          case 'text':
            if ($e.hasClass('scene_element--title')) {
              bounceInPlace($e, numberBetween(40,70));
            }
            break;
          case 'image':

            break;
        }
        $e.attr('state', 'done');
      }, 500);
    }, 300 * i);
  });
};

/**
 *
 */
function bounceInPlace($e, dist) {
  // Up.
  $e.velocity({
    translateY: '+='+(dist * -1),
  }, {
    duration: numberBetween(800,1000),
  }, "easeOutCirc");
  // Down.
  $e.velocity({
    translateY: '+='+dist,
  }, {
    duration: numberBetween(6000, 8000),
    complete: function() {
      bounceInPlace($e, dist);
    }
  }, "easeInCirc");
}


/**
 * Init orbits.
 */
function initOrbits() {
  $('.scene-element.image').each(function(i, e){
    var $e = $(this);
    var tz = $e.attr('target-zone');
    var $tz = $('[segment="' + tz + '"]');
    function orbit($e) {
      var s = numberBetween(0,3);

      var o = s%2 ? 'y' : 'x';
      var x1 = numberBetween(0, $tz.width());
      var y1 = numberBetween(0, $tz.width());
      var x = 0;
      var y = 0;
      var offset = $tz.offset();
      x = offset.left + x1 - $e.offset().left;
      y = offset.top + y1 - $e.offset().top;
      setTimeout(function(){
        $e.velocity({
          translateX: '+=' + x,
          translateY: '+=' + y,
        }, {
          'duration': numberBetween(44444,66666),
          'easing': 'linear',
        }, {
          complete: function() {
            orbit($e);
          }
        });
        $e.velocity('reverse', {
          complete: function(){
            orbit($e);
          }
        });
      });
    }
    setTimeout(function(){
      orbit($e);
    }, 900 * i);

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
    'background-image':'url("/releases/' + id + '/' + d.id + '.jpg")',
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
