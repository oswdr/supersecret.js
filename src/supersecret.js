function SuperSecretJS(element, options) {
  var me = this;
  if (!options)
    options = {};
  if (!options.colors) {
    options.colors = [{
        max: 0,
        color: [255, 0, 50]
      }, //red
      {
        max: 30,
        color: [255, 150, 50]
      }, //orange
      {
        max: 60,
        color: [225, 255, 50]
      }, // yellow
      {
        max: 100,
        color: [150, 255, 50]
      }
    ];
  }



  function getColor(percentage) {
    var colors = options.colors;

    function rgb(r, g, b) {
      return "rgb(" + r + "," + g + "," + b + ")";
    }

    function calc(start, end, p) {
      return Math.round(start - ((start - end) / 100 * p));
    }

    for (var i = 1; i < colors.length; i++) {
      if (colors[i].max >= percentage) {
        startColor = colors[i - 1];
        endColor = colors[i];
        per = (percentage - startColor.max) / (endColor.max - startColor.max) *
          100;
        break;
      }
    }

    return rgb(calc(startColor.color[0], endColor.color[0], per),
      calc(startColor.color[1], endColor.color[1], per),
      calc(startColor.color[2], endColor.color[2], per));
  }

  var upperCase = new RegExp('[A-Z]');
  var lowerCase = new RegExp('[a-z]');
  var numbers = new RegExp('[0-9]');
  var symbols = new RegExp("[\\\\|¬¦`!\"£$%^&*=()_+\\[\\]{};:'@#~<>,./? -]");

  function evaluateStrength(value) {
    var pts = 0;
    if (value.match(lowerCase))
      pts += 26;
    if (value.match(upperCase))
      pts += 26;
    if (value.match(numbers))
      pts += 10;
    if (value.match(symbols))
      pts += 36;
    console.log(pts);
    if (pts != 0)
      pts = Math.min(Math.round((Math.log(pts, 2) * value.length * 1.1)),
        100);
    showStrength(pts);
  }

  function showStrength(percentage) {
    $(me.levelBar).css({
      "background-color": getColor(percentage),
      width: (Math.round(percentage * 10) / 10) + "%"
    });
  }

  (function init() {
    // Create Elements
    me.wrapper = $(element).wrap("<div class=\"supersecret-wrapper\"></div>")
      .parent();
    me.passwordElement = $(element);
    me.showPasswordElement = me.passwordElement.clone().attr("id", null).attr(
      "type", "text").hide().appendTo(me.wrapper);
    me.levelBar = $("<div class=\"supersecret-level-bar\"></div>").appendTo(
      me.wrapper);
    $("<div style=\"clear:both;\"></div>").appendTo(me.wrapper);

    // Styles
    me.levelBar.css({
      borderRadius: me.passwordElement.css("borderRadius")
    });

    // events
    me.passwordElement.on("keyup", function() {
      me.showPasswordElement.val(me.passwordElement.val());
      evaluateStrength(me.passwordElement.val());
    });

    evaluateStrength(me.passwordElement.val());
  })();
}

SuperSecretJS.prototype.togglePassword = function() {
  if (this.passwordElement.is(":visible")) {
    this.showPassword();
  } else {
    this.hidePassword();
  }
}

SuperSecretJS.prototype.showPassword = function() {
  this.showPasswordElement.insertBefore(this.passwordElement).show();
  this.passwordElement.hide();
}

SuperSecretJS.prototype.hidePassword = function() {
  this.passwordElement.insertBefore(this.showPasswordElement).show();
  this.showPasswordElement.hide();
}
