const helpers = {
  ifCond: function(v1, ...values) {
    // El último argumento es 'options', que Handlebars pasa automáticamente
    const options = values.pop(); // El último argumento debe ser 'options'
    // Comprobamos si 'v1' está en la lista de valores
    if (values.includes(v1)) {
      return options.fn(this); // Si coincide, ejecuta el bloque
    }
    return options.inverse(this); // Si no coincide, ejecuta el bloque inverso
  },
  prev: function(value) {
    return value - 1;
  },
  next: function(value) {
    return value + 1;
  }
};

export default helpers;