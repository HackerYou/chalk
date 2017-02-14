let moment = require('moment');

let helpers =  {
  formatDate :  function(date) {
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
