import React from 'react';
import { Link, History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import media from '../../services/media.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';
import NotificationSystem from 'react-notification-system';

export default React.createClass({
	_notificationSystem: null,
	mixins: [AuthMixin,History],
	displayName: 'media',
	getInitialState(){
		return {
			media: [],
			copied: false
		}
	},
	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	},
	componentWillMount(){
		media.getMedia().then(res=>{
			this.setState({media:res.media});
		});
	},
	deleteFile(i){
		media.deleteFile(this.state.media[i].name).then(res=>{
			let updatedMedia = this.state.media.slice();
			updatedMedia.splice(i, 1);
			this.setState({media: updatedMedia});
			this._removeNotification();
			});
	},
	_successNotification: function(event) {
		// event.preventDefault;
    this._notificationSystem.addNotification({
      message: 'Copied Successfully',
      level: 'success',
			dismissible: false,
			title: 'Media'
    });
  },
	_removeNotification: function(event) {
		// event.preventDefault;
    this._notificationSystem.addNotification({
      message: 'Removed Successfully',
      level: 'error',
			dismissible: false,
			title: 'Media'
    });
  },
	renderFiles(key, index){
		return <li key={index} className="mediaRow">
					<p className="mediaIcon"><i className="chalk-doc"></i>{this.state.media[index].name}</p>
						<div className="mediaLink">
							<input type="text" defaultValue={this.state.media[index].path}/>
							<CopyToClipboard text={this.state.media[index].path} onCopy={() => {this.setState({copied: true}); this._successNotification()}}>
								<button className="success mediaCopy"><i className="chalk-copy"></i></button>
							</CopyToClipboard>
						</div>
					<p className="error" onClick={this.deleteFile.bind(this, index)}><i className="chalk-remove red"></i>Delete File</p>
				</li>
	},
	render() {
		return (
			<div>
				<NotificationSystem ref="notificationSystem" style={false}/>
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Media</h1>
				</div>
				<section className="full card detailsForm">
					<form action="">
						<label htmlFor="search" className="inline largeLabel">Search</label>
						<input type="search"/>
					</form>
				</section>
				<div className="container card mediaWrap">
					<ul className="mediaList">
						{this.state.media.map(this.renderFiles)}
					</ul>
				</div>
			</div>
		)
	}
});
