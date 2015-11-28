import React from 'react';
import { Link } from 'react-router';
import Topic from '../topic/index.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dropzone from 'react-dropzone';
import Media from '../media/index.jsx';

export default React.createClass({
	displayName: 'File',
	getInitialState(){
		return {
			copied: false
		}
	},
	render() {
		return (
			<li className="mediaRow">
				<p className="mediaIcon"><i className="chalk-doc"></i>{this.props.details.name}</p>
				<div className="mediaLink">
					<input type="text" defaultValue={this.props.details.path}/>
					<CopyToClipboard text={this.props.details.path} onCopy={() => this.setState({copied: true})}>
						<button className="success mediaCopy"><i className="chalk-copy"></i></button>
					</CopyToClipboard>
				</div>
				<button className="error">Delete File</button>
			</li>
			)
	}
});