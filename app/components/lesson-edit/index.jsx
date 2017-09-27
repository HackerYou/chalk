import React from 'react';
import { Link, History } from 'react-router';
import Lesson from '../lesson/index.jsx';
import Modal from '../modal/index.jsx';
import lessonData from '../../services/lesson.jsx';
import topicsData from '../../services/topic.jsx';
import Markdown from 'react-remarkable';
import coursesData from '../../services/courses.jsx';
import hljs from 'highlight.js';
import Exercise from '../exercise/index.jsx';
import Dropzone from 'react-dropzone';
import Media from '../../services/media.jsx';
import Loading from '../loading/index.jsx';

let placeholder = document.createElement('div');
placeholder.className = 'placeholder';
placeholder.style.height = '44px';

export default React.createClass({
	displayName: 'EditLesson',
	mixins: [History],
	getInitialState(){
		return {
			isModalOpen: false,
			isMediaModalOpen: false,
			lesson: [],
			lessonTopics: [],
			topics: [],
			selectedTopics:[],
			selectValue: 'all',
			uniqueTopics: [],
			isTemplate: false,
			searchTopic: '',
			loading: false
		}
	},
	componentWillMount(){
		lessonData.getLessonById(this.props.params.lessonId).then(res => {
			this.setState({
				lesson: res.lesson,
				lessonTopics: res.lesson.topics
			});
		});

		coursesData.getCourseById(this.props.params.classroomId).then(res=>{
			this.setState({
				isTemplate: res.course.template
			});
		});

		topicsData.getTopics().then(res=>{
			this.setState({
				topics: res.topic
			});
			let topics = (this.state.topics).map((key, index) => {
				return this.state.topics[index].category;
			});
			let uniqueTopics = topics.reduce((a,b) => {
				if (a.indexOf(b) < 0) a.push(b);
				return a;
			}, []);
			this.setState({
				uniqueTopics: uniqueTopics,
				selectedTopics: this.state.topics
			});
		});
	},
	componentDidUpdate(){
		// when drag and drop reordering occurs, update section
		lessonData.updateLesson(this.props.params.lessonId, {});
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(e){
		this.setState({isModalOpen: false});
	},
	openMediaModal() {
		this.setState({
			isMediaModalOpen: true
		});
	},
	closeMediaModal() {
		this.setState({
			isMediaModalOpen: false
		});
	},
	getValue(e){
		this.setState({selectValue: e.target.value});
		let topic = e.target.value;
		let matches = (this.state.topics).filter((obj)=>{
			return obj.category === topic;
		});
		if (e.target.value === 'all'){
			this.setState({selectedTopics: this.state.topics})
		} else {
			this.setState({selectedTopics: matches});
		}
	},
	renderTopics(key, index){
		return <option key={index} value={this.state.selectedTopics[index]._id}>{this.state.selectedTopics[index].title}</option>
	},
	renderTopicCategories(key, index){
		return <option key={index} value={this.state.uniqueTopics[index]}>{this.state.uniqueTopics[index]}</option>
	},
	addTopic(e){
		// e.preventDefault();
		let topicId = this.refs.selectedTopic.value;
		let addTopic = lessonData.addTopicToLesson(this.props.params.lessonId, topicId, {
			'topics': topicId
		});

		let getTopic = topicsData.getTopicById(topicId);
		$.when(addTopic, getTopic).then((addRes, getRes)=>{
			this.closeModal();
			let updatedTopics = this.state.lessonTopics.slice();
			updatedTopics.push(getRes[0].topic);
			this.setState({lessonTopics: updatedTopics});
		});
	},
	deleteTopic(id){
		let deleteConfirm = confirm('Are you sure you want to delete this topic?');
		const topicToDelete = this.state.lessonTopics.find(l => l._id === id);
		const topicIndex = this.state.lessonTopics.findIndex(l => l._id === id);
		if(deleteConfirm) {
			lessonData.deleteTopicFromLesson(this.props.params.lessonId, topicToDelete._id).then(res=>{
				let updatedLessons = this.state.lessonTopics.slice();
				updatedLessons.splice(topicIndex, 1);
				this.setState({lessonTopics: updatedLessons});
			});
		}
	},
	editTopic(index){
		this.history.pushState(null,`/topic/${index}/edit`);
	},
	dragStart(e){
		this.dragged = e.currentTarget;
		e.dataTransfer.effectAllowed = 'move'
		// Firefox requires calling dataTransfer.setData for the drag to work 
		//(http://webcloud.se/sortable-list-component-react-js/)
		e.dataTransfer.setData('text/html', e.currentTarget);
	},
	dragEnd(e){
		this.dragged.style.display = 'block';
		this.dragged.parentNode.removeChild(placeholder);
		//update state
		let topics = this.state.lessonTopics;
		let prevIndex = Number(this.dragged.dataset.id);
		let newIndex = Number(this.over.dataset.id);

		if (prevIndex < newIndex) newIndex--;
		if(this.nodePlacement == "after") newIndex++;

		topics.splice(prevIndex, 0, topics.splice(newIndex, 1)[0]);
		this.setState({
			lessonTopics: topics
		});
	},
	dragOver(e){
		e.preventDefault;
		this.dragged.style.display = 'none';
		if(e.target.className == 'placeholder') return;

			//get the parent div that is currently being dragged over 
			this.over = e.target.closest('.lessonTopic');
			//track relative positioning of mouse inside element being dragged over
				
			var pos = this.over.getBoundingClientRect();
			var mousePos = e.clientY;
			var relY = mousePos - pos.top;
			var height = this.over.offsetHeight / 2;
			let parent = e.target.closest('.lessonTopic').parentNode;

			if (relY > height){
				this.nodePlacement = 'after';
				parent.insertBefore(placeholder, this.over.nextElementSibling);
			} else if (relY < height){
				this.nodePlacement = "before";
				parent.insertBefore(placeholder, this.over);
			} 
			
	},
	displayTopics(key, index){
		let hl = function (str, lang) {
	    if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (err) {}
	    }
	    try {
			return hljs.highlightAuto(str).value;
	    } catch (err) {}
	    	return ''; // use external default escaping
	  	};
		return <div key={key._id} className='lessonTopic' draggable="true" onDragEnd={this.dragEnd} onDragStart={this.dragStart} data-id={index} >
					<details>
					<summary className="lessonTitle">{this.state.lessonTopics[index].title}</summary>
					<div className="deleteTopicBlock">
						<p data-id={this.state.lessonTopics[index]._id} onClick={this.deleteTopic.bind(this, key._id)} className="deleteTopic"><i className="chalk-remove "></i>Remove {this.state.lessonTopics[index].title}</p>
						<p data-id={this.state.lessonTopics[index]._id} onClick={this.editTopic.bind(this, this.state.lessonTopics[index]._id)} className="editTopic"><i className="chalk-edit "></i>Edit {this.state.lessonTopics[index].title}</p>
					</div>
					<Markdown options={{'html':true, highlight: hl}}>{this.state.lessonTopics[index].body}</Markdown>
					</details>
				</div>
	},
	handleChange(e){
		let stateObj = this.state.lesson;
		stateObj[e.target.id] = e.target.value;
		this.setState({
			lesson: stateObj
		});
	},
	saveLesson(e){
		e.preventDefault();
		//update title of lesson
		lessonData.updateLesson(this.props.params.lessonId, {
			title: this.state.lesson.title,
			//Send the components lesson topics instead of the initial 
			//this.state.lesson.topics, since they have not been updated.
			topics: this.state.lessonTopics
		});
		// send user back to the classroom they were editing
		let classroomId = this.props.params.classroomId;
		if (this.state.isTemplate) {
			this.history.pushState(null,`/course-templates/${classroomId}/edit`);
		} else {
			this.history.pushState(null,`/classroom/${classroomId}/edit`);
		}
	},
	deleteLesson(e){
		e.preventDefault();
		let deleteConfirm = confirm('Are you sure you want to delete this lesson?');

		if(deleteConfirm) {
			lessonData.deleteLesson(this.props.params.lessonId).then(res=>{
				let classroomId = this.props.params.classroomId;
				if (this.state.isTemplate) {
					this.history.pushState(null,`/course-templates/${classroomId}/edit`);
				} else {
					this.history.pushState(null,`/classroom/${classroomId}/edit`);
				}
			});
		}
	},
	searchByTopicName(e) {
		const searchValue = e.target.value;
		const matches = (this.state.topics).filter((topic) => {
			return topic.title.match(new RegExp(searchValue,'ig'));
		});
		
		if(searchValue.length === 0) {
			this.setState({selectedTopics: this.state.topics})
		} else {
			this.setState({selectedTopics: matches});
		}
	},
	onDrop(file) {
		this.setState({
			loading: true
		});
		Media.uploadFile(file[0])
			.then((data) => {
				const fileName = data.media.path;
				const newLesson = Object.assign({
					exercise_link: fileName
				}, this.state.lesson);
				lessonData.updateLesson(this.state.lesson._id, newLesson)
					.then((data) => {
						this.setState({
							lesson: data.lesson,
							loading: false
						});
						this.closeMediaModal();
					});
			});
	},
	render() {
		let exerciseLink = '';
		if(this.state.lesson.exercise_link && this.state.lesson.exercise_link.length > 0) {
			exerciseLink = <Exercise link={this.state.lesson.exercise_link} />
		}
		return (
			<div className="full">
				<header className="container">
					<Link className="linkBtn" to={this.state.isTemplate? `/course-templates/${this.props.params.classroomId}/edit` : `/classroom/${this.props.params.classroomId}/edit`}><button className="primary"><i className="chalk-home"></i>{this.state.isTemplate ? 'back to template' : 'back to classroom'}</button></Link>
				</header>
				<div className="full card detailsForm">
					<form action="">
						<div className="fieldRow">
							<label htmlFor="lessonName" className="inline largeLabel">Topic Name</label>
							<input onChange={this.handleChange} type="text" placeholder="enter lesson name here" value={this.state.lesson.title} id="title"/>
							<button className="success" onClick={this.saveLesson}><i className="chalk-save"></i>Save Lesson</button>
							<button onClick={this.deleteLesson}className="error"><i className="chalk-remove"></i>Delete Lesson</button>
						</div>
					</form>
				</div>
				<div className="container">
					<div className="lessonTopic">
						<div className="lessonHeader">
							<h2 className="lessonTitle">{this.state.lesson.title}</h2>
							<div>
								<p><a href="#" onClick={this.openMediaModal}><i className="fa fa-cloud-upload"></i> Upload Exercise Files</a></p>
								{exerciseLink}
							</div>
						</div>
						<Modal isOpen={this.state.isMediaModalOpen} transitionName='modal-animation'>
							<div className="modalBody--small card loginModal">
								<i className="chalk-close" onClick={this.closeMediaModal}></i>
								<h3>Upload an exercise file</h3>
								<p>Please give it a good name, for example <code>pt-class8-exercises.zip</code>.</p>
								<Dropzone onDrop={this.onDrop} className="dropZone">
									<p>Drag and drop files here or click to select files to upload</p>
								</Dropzone>
							</div>
						</Modal>
						<p className="title">Drag and drop to reorder topics(One at the time for now, multiple rows coming soon!)</p>
					</div>
				</div>
				<div className="lessonEditView card">
						<div onDragOver={this.dragOver}>{(this.state.lessonTopics).map(this.displayTopics)}</div>
						<div onClick={this.openModal} className="topicAddBlock"><h3><i className="chalk-add"></i>Add Topic</h3></div>
						<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
							<div className="modalBody--small card">
							<i className="chalk-close" onClick={this.closeModal}></i>
							<form onSubmit={e => e.preventDefault()}>
								<h2>Add Topic</h2>
								<h3>Search By Topic Name</h3>
								<input type="text" placeholder='eg. Floats' onChange={this.searchByTopicName}/>
								<h4>Filter by category</h4>
									<div className="inlineFieldRow">
										<div className="fieldGroup">
											<label htmlFor="">Category</label>
											<select onChange={this.getValue} name="category" id="">
												<option value="all">ALL</option>
												<option value="html">HTML</option>
												<option value="css">CSS</option>
												<option value="javascript">JavaScript</option>
												<option value="javascript-pt">Part Time - JavaScript</option>
												<option value="git">Git</option>
												<option value="wordpress">WordPress</option>
												<option value="wordpress-pt">Part Time - WordPress</option>
												<option value="tools">Tools</option>
												<option value="project">Project</option>
												<option value="resource">Resource</option>
												<option value="seo">SEO</option>
												<option value="ux">UX</option>
											</select>
										</div>
										<div className="fieldGroup">
											<label htmlFor="">Topic</label>
											<select ref="selectedTopic" name="topics" id="">
												{(this.state.selectedTopics.sort((a,b) => {

													return a.title.toLowerCase().charCodeAt(0) - b.title.toLowerCase().charCodeAt(0)
												})).map(this.renderTopics)}
											</select>
										</div>
									</div>
								<div onClick={this.addTopic} className="button success">Save Content</div>
								<div onClick={this.closeModal} className="button error">Cancel</div>
							</form>
						</div>
						</Modal>
					</div>
					<button className="success" onClick={this.saveLesson}><i className="chalk-save"></i>Save Lesson</button>
					<Loading loading={this.state.loading}/>
				</div>
		)
	}
});
