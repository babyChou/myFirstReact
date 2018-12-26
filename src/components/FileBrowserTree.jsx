import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { translate } from "react-i18next";

import Dialog from "./Dialog";

import { GET_DIRECTORY, CREATE_DIRECTORY, MODIFY_DIRECTORY, DELETE_DIRECTORY } from "../helper/Services";

/* const mapDispatchToProps = (dispatch) => {
    return {
        action: () => {
            dispatch(actionAction());
        },
    };
};

const mapStateToProps = ({ state }) => ({
    prop: state.prop
}); */


export class FileBrowserTree extends React.Component {
	constructor(props) {
		super(props);

        this.state = {
        	selectDir : props.path || '\\',
        	isSelectDialogShow : true,
        	directory : {
        		directory : [{
        				"name": "",
		        		"subDirectory": true,
		        		"time": "12/17/2018 09:35 AM",
		        		"directory" : [
			        		{
				        		"name": "WebAPI",
				        		"subDirectory": true,
				        		"time": "12/17/2018 09:35 AM",
				        		"directory" : [
					        		{
					        			"name": "app",
					        			"subDirectory": true,
					        			"time": "12/17/2018 09:35 AM",
					        			"directory" : [
					        				{
					        					"name": "app",
							        			"subDirectory": true,
							        			"time": "12/17/2018 09:35 AM",
					        				},
					        				{
					        					"name": "app",
							        			"subDirectory": true,
							        			"time": "12/17/2018 09:35 AM",
					        				}

					        			],
					        			"file" : []
					        		}
				        		],
				        		file : []
				        	},
				        	{
				        		"name": "keyaki",
				        		"subDirectory": true,
				        		"time": "12/17/2018 09:37 AM",
				        		"directory" : [
					        		{
					        			"name": "app",
					        			"subDirectory": true,
					        			"time": "12/17/2018 09:35 AM",

					        		}
				        		],
				        		file : []
				        	}
		        		]
        			}],
        		file : []
        	}
        	
        }

        this.treeZone = React.createRef();

        this.toggleFolder = this.toggleFolder.bind(this);
        this.treeItem = this.treeItem.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.isSubTreeLoaded = this.isSubTreeLoaded.bind(this);
        this.loadDirectory = this.loadDirectory.bind(this);
	}
	componentDidMount() {
		this.loadDirectory();
	}
	loadDirectory() {
		const dirArr = this.state.selectDir.replace(/(\\)$/,'').split('\\');
		let dir = '';
		let mainData = {
			directory : [{
				"name": "",
				"subDirectory": true,
				"directory" : [],
				"file" : []
			}]
		};

		(function loadDir(dir, currData) {
			dir += dirArr.shift() + '\\';
			
			GET_DIRECTORY.fetchData({
				'type': 0,
				'directory': dir
			}).then(data => {
				if(data.result === 0) {
					currData.open = true;
					currData.directory = data.directory;
					currData.file = data.file;

					if(dirArr.length > 0) {
						loadDir.bind(this)(dir, currData.directory.find(item => item.name === dirArr[0]));
					}else{

						this.setState({
							directory : mainData
						});
					}
				}
			});
		}).bind(this)(dir, mainData.directory[0]);

	}
	toggleFolder(e) {
		const { directory } = this.state;
		const currDom = e.currentTarget;
		const subTreeDom = currDom.parentNode.parentNode.querySelector('.subTree');
		const targetDir = (currDom.parentNode.dataset.dir).replace(/(\\)$/,'');

		if(!this.isSubTreeLoaded(targetDir, directory.directory)) {	

			GET_DIRECTORY.fetchData({
				'type': 0,
				'directory': targetDir
			}).then(data => {
				if(data.result === 0) {
					let dirData = this.insertDirectory(directory.directory, {
						open : true,
						directory : data.directory,
						file : data.file
					}, targetDir);

					this.setState({
						directory : {
							directory : dirData
						}
					});
				}
			});

		}else{

			this.setState({
				directory : {
					directory : this.updateDirectory(directory.directory, { open : !subTreeDom.classList.contains('subTree_open') }, targetDir)
				}
			});
		}


	}

	updateDirectory(currData, newData, dir) {
		let oldData = JSON.parse(JSON.stringify(currData));
		let dirArr = dir.split('\\');
		let currDirName = '';
		let _currData = oldData;

		while(dirArr.length > 0) {
			currDirName = dirArr.shift();
			_currData = _currData.find(item => item.name === currDirName);

			if(dirArr.length > 0) {
				_currData = _currData.directory;
			}
		}

		Object.assign(_currData, newData);

		// console.log(dir, _currData, oldData);

		return oldData;
	}
	insertDirectory(currData, newData, dir) {
		let oldData = JSON.parse(JSON.stringify(currData));
		let dirArr = dir.split('\\');
		let currDirName = '';
		let _currData = oldData;

		while(dirArr.length > 0) {
			currDirName = dirArr.shift();
			_currData = _currData.find(item => item.name === currDirName);

			if(dirArr.length > 0) {
				_currData = _currData.directory;
			}
		}

		_currData.open = newData.open;
		_currData.directory = newData.directory;
		_currData.file = newData.file;

		// console.log(dir, _currData, oldData);

		return oldData;
	}

	isSubTreeLoaded(dir, directory) {
		const dirArr = dir.split('\\');
		let currDir = dirArr[0];
		const currDirObj = directory.filter(item => currDir === item.name);
		const isLastItem = (dirArr.length === 1);

		if(isLastItem) {
			if(!!currDirObj[0].directory) {
				return currDirObj[0].directory.length > 0;
			}else{
				return false;
			}
		}else{

			if(!!currDirObj[0]) {
				if(!!currDirObj[0].directory && currDirObj[0].directory.length > 0) {
					return this.isSubTreeLoaded(dirArr.splice(1).join('\\'), currDirObj[0].directory);
				}else{
					alert('error');
					return false;
				}
			}
		}

	}
	selectItem(e) {
		const currDom = e.currentTarget;
		this.treeZone.current.querySelectorAll('.bg-tree-selected').forEach(el => {
			el.classList.remove('bg-tree-selected');
		});

		currDom.parentNode.classList.add('bg-tree-selected');

		// this.selectDir = currDom.parentNode.dataset.dir;
		this.setState({
			selectDir : currDom.parentNode.dataset.dir 
		});


		this.props.updatePath(currDom.parentNode.dataset.dir);
		// console.log(this.selectDir);
	}
	treeItem(tree, dir) {
		return tree.map((item,i) => {
			let currDir = dir + item.name;
			let itemCss = 'pl-1 d-flex align-items-center';
			let trangleCss = 'trangle_right d-block';
			let subTreeCss = 'pl-3 subTree';

			if(currDir !== '\\') {
				currDir += '\\';
			}

			// console.log(currDir,this.selectDir, currDir === this.selectDir);

			if(currDir === this.state.selectDir) {
				itemCss += ' bg-tree-selected';
			}

			if(item.open) {
				trangleCss += ' trangle_open';
				subTreeCss += ' subTree_open';
			}

			return (
				<ul key={i} className="list-unstyled">
					<li className={itemCss} data-dir={currDir}>
						{ item.subDirectory ? <i className={trangleCss} onClick={this.toggleFolder}></i> : <span className="mr_11px"></span>}
						{ item.subDirectory ? <button type="button" className="icon_folder btn_icon mb-1" onClick={this.toggleFolder}></button> : <button type="button" className="icon_folder btn_icon mb-1"></button>}
						<span onClick={this.selectItem}>{item.name}</span>
					</li>
					{!!item.directory > 0 ? <li className={subTreeCss}>{this.treeItem(item.directory, currDir)}</li> : null}
				</ul>
			);
		});
	}
    render() {
        const { t } = this.props;
        const { isSelectDialogShow, directory, selectDir } = this.state;
        return (
            <div className="">
            	<div className="input-group mb-3">
            		<div className="input-group-prepend">
            			<span className="input-group-text bg-white">{t('msg_current_path')}</span>
            		</div>
            		<input type="text" className="form-control h_auto bg-white" readOnly aria-label="select Dir" value={selectDir}/>
            		<div className="input-group-append">
            			<span className="input-group-text">
            				<button class="btn_reconvert" type="button"></button>
            			</span>
            		</div>
            	</div>
            	
            	<div className="treeZone border p-1" ref={this.treeZone}>
            		{this.treeItem(directory.directory, '\\')}
            	</div>
			</div>
        );
    }
}

/* export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileBrowserTree); */

export default compose(
	translate("translation"),
	connect(null, null)
)(FileBrowserTree);



