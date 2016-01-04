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
  if(!options.suggestions) {
    options.suggestions = [];
  }
  if(!options.rules) {
    options.rules = [{
      points: 26,
      regex : new RegExp('[a-z]')
    },{
      points: 26,
      regex : new RegExp('[A-Z]')
    },{
      points: 10,
      regex : new RegExp('[0-9]')
    },{
      points: 36,
      regex : new RegExp("[\\\\|¬¦`!\"£$%^&*=()_+\\[\\]{};:'@#~<>,./? -]")
    }];
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

  function evaluateStrength(value) {
    var pts = 0;

    for(var i = 0; i < options.rules.length; i++) {
      if(typeof options.rules[i].regex) {
        pts += value.match(options.rules[i].regex) ? options.rules[i].points : 0;
      } else {
        pts += options.rules[i].matches(value) ? options.rules[i].points : 0;
      }
    }

    if (pts != 0)
      pts = Math.min(Math.round((Math.log(pts, 2) * value.length * 1.1)), 100);
    showStrength(pts);
    updateSuggestions(value);
  }
  function updateSuggestions(value) {
    var valid = true;
    $(me.suggestionPane).children().each(function(i, item){
      if(options.suggestions[i].matches(value)) {
        $(item).addClass("ok");
      } else {
        $(item).removeClass("ok");
        if(options.suggestions[i].required)
          valid = false;
      }
    });
    if(!valid) {
      $(".supersecret-wrapper").children("input").addClass("invalid");
    } else {
      $(".supersecret-wrapper").children("input").removeClass("invalid");
    }
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
    me.suggestionPane = $("<div class=\"suggestion-pane\"></div>").appendTo(me.wrapper);
    for(var s = 0; s < options.suggestions.length; s++) {
      $("<div class=\"suggestion-item\">"+ options.suggestions[s].description +"</div>").appendTo(me.suggestionPane);
    }

    me.passwordElement.focus(function(){
      me.wrapper.addClass("focussed");
    }).blur(function(){
      me.wrapper.removeClass("focussed");
    });
    me.showPasswordElement.focus(function(){
      me.wrapper.addClass("focussed");
    }).blur(function(){
      me.wrapper.removeClass("focussed");
    });

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
