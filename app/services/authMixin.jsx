import auth from './authentication.jsx';

export default {
	componentWillMount() {
		if(auth.authenticated() === "false") {
			this.context.history.pushState(null,'/');
		}
	}	
};