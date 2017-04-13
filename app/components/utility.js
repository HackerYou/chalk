let moment = require('moment');

let helpers =  {
  fold: function(arr) {
    return arr[0];
  },
  expect: function(obj, prop, _default) {
    return obj ? obj[prop] : _default;
  },
  formatDate: function(date) {
  	return moment(date).format('MMMM D YYYY').toString();
  },
  isEmpty: function(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    } 
    return true;
  }
}



export default helpers;
