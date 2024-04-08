const helpers = {
  ifCond: function(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  prev: function(value) {
    return value - 1;
  },
  next: function(value) {
    return value + 1;
  }
};

export default helpers;