'use strict';

module.exports = function(options) {
  return function(app) {
    for (var key in styles) {
      createMethod(this, key, styles[key]);
    }
  };

  function createMethod(app, key, style) {
    if (style.open) {
      app.style(key, function(msg) {
        return style.open + msg + style.close;
      });
    }
  }
};

var styles = module.exports.styles = {
  modifiers: {
    reset: {
      open: '\u001b[0m',
      close: '\u001b[0m'
    },
    bold: {
      open: '\u001b[1m',
      close: '\u001b[22m'
    },
    dim: {
      open: '\u001b[2m',
      close: '\u001b[22m'
    },
    italic: {
      open: '\u001b[3m',
      close: '\u001b[23m'
    },
    underline: {
      open: '\u001b[4m',
      close: '\u001b[24m'
    },
    inverse: {
      open: '\u001b[7m',
      close: '\u001b[27m'
    },
    hidden: {
      open: '\u001b[8m',
      close: '\u001b[28m'
    },
    strikethrough: {
      open: '\u001b[9m',
      close: '\u001b[29m'
    }
  },
  colors: {
    black: {
      open: '\u001b[30m',
      close: '\u001b[39m'
    },
    red: {
      open: '\u001b[31m',
      close: '\u001b[39m'
    },
    green: {
      open: '\u001b[32m',
      close: '\u001b[39m'
    },
    yellow: {
      open: '\u001b[33m',
      close: '\u001b[39m'
    },
    blue: {
      open: '\u001b[34m',
      close: '\u001b[39m'
    },
    magenta: {
      open: '\u001b[35m',
      close: '\u001b[39m'
    },
    cyan: {
      open: '\u001b[36m',
      close: '\u001b[39m'
    },
    white: {
      open: '\u001b[37m',
      close: '\u001b[39m'
    },
    gray: {
      open: '\u001b[90m',
      close: '\u001b[39m'
    },
    grey: {
      open: '\u001b[90m',
      close: '\u001b[39m'
    }
  },
  bgColors: {
    bgBlack: {
      open: '\u001b[40m',
      close: '\u001b[49m'
    },
    bgRed: {
      open: '\u001b[41m',
      close: '\u001b[49m'
    },
    bgGreen: {
      open: '\u001b[42m',
      close: '\u001b[49m'
    },
    bgYellow: {
      open: '\u001b[43m',
      close: '\u001b[49m'
    },
    bgBlue: {
      open: '\u001b[44m',
      close: '\u001b[49m'
    },
    bgMagenta: {
      open: '\u001b[45m',
      close: '\u001b[49m'
    },
    bgCyan: {
      open: '\u001b[46m',
      close: '\u001b[49m'
    },
    bgWhite: {
      open: '\u001b[47m',
      close: '\u001b[49m'
    }
  },
  reset: {
    open: '\u001b[0m',
    close: '\u001b[0m'
  },
  bold: {
    open: '\u001b[1m',
    close: '\u001b[22m'
  },
  dim: {
    open: '\u001b[2m',
    close: '\u001b[22m'
  },
  italic: {
    open: '\u001b[3m',
    close: '\u001b[23m'
  },
  underline: {
    open: '\u001b[4m',
    close: '\u001b[24m'
  },
  inverse: {
    open: '\u001b[7m',
    close: '\u001b[27m'
  },
  hidden: {
    open: '\u001b[8m',
    close: '\u001b[28m'
  },
  strikethrough: {
    open: '\u001b[9m',
    close: '\u001b[29m'
  },
  black: {
    open: '\u001b[30m',
    close: '\u001b[39m'
  },
  red: {
    open: '\u001b[31m',
    close: '\u001b[39m'
  },
  green: {
    open: '\u001b[32m',
    close: '\u001b[39m'
  },
  yellow: {
    open: '\u001b[33m',
    close: '\u001b[39m'
  },
  blue: {
    open: '\u001b[34m',
    close: '\u001b[39m'
  },
  magenta: {
    open: '\u001b[35m',
    close: '\u001b[39m'
  },
  cyan: {
    open: '\u001b[36m',
    close: '\u001b[39m'
  },
  white: {
    open: '\u001b[37m',
    close: '\u001b[39m'
  },
  gray: {
    open: '\u001b[90m',
    close: '\u001b[39m'
  },
  grey: {
    open: '\u001b[90m',
    close: '\u001b[39m'
  },
  bgBlack: {
    open: '\u001b[40m',
    close: '\u001b[49m'
  },
  bgRed: {
    open: '\u001b[41m',
    close: '\u001b[49m'
  },
  bgGreen: {
    open: '\u001b[42m',
    close: '\u001b[49m'
  },
  bgYellow: {
    open: '\u001b[43m',
    close: '\u001b[49m'
  },
  bgBlue: {
    open: '\u001b[44m',
    close: '\u001b[49m'
  },
  bgMagenta: {
    open: '\u001b[45m',
    close: '\u001b[49m'
  },
  bgCyan: {
    open: '\u001b[46m',
    close: '\u001b[49m'
  },
  bgWhite: {
    open: '\u001b[47m',
    close: '\u001b[49m'
  }
};
