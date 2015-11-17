import React from 'react';
import Announcement from '../announcement/index.jsx';


export default React.createClass({
	displayName: 'Announcements',
	getInitialState(){
		return{
			announcements: {}
		}
	},
	componentDidMount(){
		let data = require('../sample-data.js');
		this.setState({
			announcements: data.announcement
		});
	},
	renderAnnouncements(key){
		return <Announcement key={key} index={key} details={this.state.announcements[key]} />
	},
	render() {
		return (
			<aside>
				<h3>Announcements</h3>
				<ul>
					{Object.keys(this.state.announcements).map(this.renderAnnouncements)}
				</ul>
				<button className="success">Make Announcement</button>
			</aside>
		);
	}
});