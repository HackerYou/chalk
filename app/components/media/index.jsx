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
		return <li key={index} className="mediaRow">
					<p className="mediaIcon"><i className="chalk-doc"></i>{this.state.media[index].name}</p>
						<div className="mediaLink">
							<input type="text" defaultValue={this.state.media[index].path}/>
							<CopyToClipboard text={this.state.media[index].path} onCopy={() => this.setState({copied: true})}>
								<button className="success mediaCopy"><i className="chalk-copy"></i></button>
							</CopyToClipboard>
						</div>
					<button onClick={this.deleteFile.bind(this, index)} className="error">Delete File</button>
				</li>
	},
	render() {
		return (
			<div>
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
						<h1>Media</h1>
					</header>
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