//TODO Creando un helpers para comparar dos expresiones
const helpers = {
  ifCond: function(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  }
};

export default helpers;