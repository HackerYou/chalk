let moment = require('moment');

let helpers =  {
  formatDate :  function(date) {
  	return moment(date).format('MMMM D YYYY').toString();
  }
}

export default helpers;
