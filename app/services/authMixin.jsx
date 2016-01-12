import auth from './authentication.jsx';
import config from './config.jsx';

export default {
	componentWillMount() {
		if(auth.authenticated() === "false" || !config.getUserId()) {
			this.context.history.pushState(null,'/');
		}
	}	
};