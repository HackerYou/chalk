import React from 'react';
import { Link, History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import media from '../../services/media.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';


export default React.createClass({
	mixins: [AuthMixin,History],
	displayName: 'media',
	getInitialState(){
		return {
			media: [],
			copied: false
		}
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
			});
	},
	renderFiles(key, index){
		return <li key={index}>
					<p><i className="chalk-doc"></i>{this.state.media[index].name}</p>
						<input type="text" defaultValue={this.state.media[index].path}/>
					<CopyToClipboard text={this.state.media[index].path} onCopy={() => this.setState({copied: true})}>
						<button className="success"><i className="chalk-copy"></i></button>
					</CopyToClipboard>
					<button onClick={this.deleteFile.bind(this, index)} className="error">Delete File</button>
				</li>
	},
	render() {
		return (
			<div>
				<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<h1>Media</h1>
				<form action="" className="card">
					<h3>Search</h3>
					<input type="search"/>
				</form>
				<ul className="card">
					{this.state.media.map(this.renderFiles)}
				</ul>
			</div>
		)
	}
});