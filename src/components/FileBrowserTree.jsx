import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { translate } from "react-i18next";

import DialogPortal from "./DialogPortal";

import { RECORD_STORE_DEVICE } from "../constant/Common.Consts";
import { GET_STORE_DEVICE_LIST, GET_DIRECTORY, CREATE_DIRECTORY, MODIFY_DIRECTORY, DELETE_DIRECTORY } from "../helper/Services";


// msg_delete_folder_error_not_empty : '刪除失敗，資料夾非為空',
// msg_create_folder_error : '建立資料夾失敗',
// msg_delete_folder_error : '刪除資料夾失敗',
// msg_modify_folder_name_error : '修改資料夾名稱失敗',

export class FileBrowserTree extends React.Component {
	constructor(props) {
		super(props);

        this.state = {
        	newDirErr : 'New Folder',
        	selectDir : props.path || '\\',
        	storeageType : props.storeageType,
        	storeageList : [],
        	showMenu : false,
        	isDialogShow : false,
        	dialogParams : {
        		mainMsg : props.t('msg_load_store_device_error'),
        		msg : '',
        		ok : this.checkStoreDeviceList.bind(this),
        		type : 'alert',
        		icon : 'error',
        		title : props.t('msg_an_error_occurred')
        	},
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
        this.initDirectory = this.initDirectory.bind(this);
        this.createFolder = this.createFolder.bind(this);
        this.deleteFolder = this.deleteFolder.bind(this);
        this.getDirectoryInfo = this.getDirectoryInfo.bind(this);
        this.showList = this.showList.bind(this);
        this.closeList = this.closeList.bind(this);
        this.changeCreateInput = this.changeCreateInput.bind(this);

	}
	componentDidMount() {
		
		GET_STORE_DEVICE_LIST.fetchData().then(data => {
			const  storeageList = data.storeDevices;
			if(data.result === 0) {

				if(storeageList.length > 0) {
					let storeageType = this.state.storeageType;
					let selectDir = this.state.selectDir;

					if(!storeageList.includes(storeageType)) {
						storeageType = storeageList[0];
						selectDir = '\\';
					}

					this.setState({
						storeageList,
						storeageType,
						selectDir
					}, () => {
						this.initDirectory();
					});
					
				}else{
					
					this.setState({
						isDialogShow : true,
						dialogParams : {
							...this.state.dialogParams,
							mainMsg : this.props.t('msg_load_store_device_error'),
							msg : '',
							ok : () => {
								this.setState({
									isDialogShow : false
								});

								this.props.updateParentState({
									isSelectDialogShow : false,
									storeageType : '',
									dir : '\\',
									file : [],
									storeageList : []
								})
							}
						}
					});
				}

			}
		});

		document.addEventListener('keydown', this.deleteFolder);

	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.deleteFolder);
	}
	checkStoreDeviceList() {
		GET_STORE_DEVICE_LIST.fetchData().then(data => {
			if(data.result === 0) {
				const storeageList = data.storeDevices;

				if(storeageList.length > 0) {
					let storeageType = this.state.storeageType;
					let selectDir = this.state.selectDir;
					if(!storeageList.includes(storeageType)) {
						storeageType = storeageList[0];
						selectDir = '\\';
					}

					this.setState({
						storeageList,
						storeageType,
						selectDir,
						isDialogShow : false
					}, () => {
						this.initDirectory();
					});
					
				}else{
					
					this.setState({
						isDialogShow : false
					}, () => {

						this.props.updateParentState({
							dir: '\\',
							file : [],
							storeageType : '',
							storeageList : [],
							isSelectDialogShow : false
						});
						
					});

				}

			}else{
				//Really error
				alert(data.result);
			}
		});
	}
	initDirectory() {
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
				'type': this.state.storeageType,
				'directory': dir
			}).then(data => {
				if(data.result === 0) {
					currData.open = true;
					currData.directory = data.directory;
					currData.file = data.file;

					if(dirArr.length > 0) {
						loadDir.bind(this)(dir, currData.directory.find(item => item.name === dirArr[0]));
					}else{
						currData.open = false;
						this.setState({
							directory : mainData
						});
					}
				}else{
					//TODO: update message
					this.setState({
						isDialogShow : true,
						dialogParams : {
							...this.state.dialogParams,
							mainMsg : `Load directory error. result : ${data.result}`,
							msg : ''
						}
					});
				}
			});
		}).bind(this)(dir, mainData.directory[0]);

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
				'type': this.state.storeageType,
				'directory': dir
			}).then(data => {
				if(data.result === 0) {
					currData.open = true;
					currData.directory = data.directory;
					currData.file = data.file;

					if(dirArr.length > 0) {
						loadDir.bind(this)(dir, currData.directory.find(item => item.name === dirArr[0]));
					}else{
						currData.open = this.getDirectoryInfo(dir).open;
						this.setState({
							directory : Object.assign({...this.state.directory}, mainData)
						});
					}
				}else{
					//TODO: update message
					this.setState({
						isDialogShow : true,
						dialogParams : {
							...this.state.dialogParams,
							mainMsg : `Load directory error. result : ${data.result}`,
							msg : ''
						}
					});
				}
			});
		}).bind(this)(dir, mainData.directory[0]);
	}
	getDirectoryInfo(dir) {
		const searchDirArr = dir.replace(/(\\)$/,'').split('\\');
		const directory = [...this.state.directory.directory];
		let result = directory;
		let searchItem;

		for(let i = 0; i < searchDirArr.length; i++) {
			searchItem = result.find(item => item.name === searchDirArr[i]);

			if(searchItem) {

				if(i === searchDirArr.length - 1) {//last item
					result = searchItem;
				}else{
					result = searchItem.directory;
				}
			} 
		}


		return result;

	}
	toggleFolder(e) {
		const { directory } = this.state;
		const currDom = e.currentTarget;
		const subTreeDom = currDom.parentNode.parentNode.querySelector('.subTree');
		const targetDir = (currDom.parentNode.dataset.dir).replace(/(\\)$/,'');

		if(!this.isSubTreeLoaded(targetDir, directory.directory)) {	

			GET_DIRECTORY.fetchData({
				'type': this.state.storeageType,
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
				}else{
					//TODO: update message
					this.setState({
						isDialogShow : true,
						dialogParams : {
							...this.state.dialogParams,
							mainMsg : `Load directory error. result : ${data.result}`,
							msg : ''
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
		const findItem = (item => item.name === currDirName);

		while(dirArr.length > 0) {
			currDirName = dirArr.shift();
			_currData = _currData.find(findItem);

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
		const findItem = (item => item.name === currDirName);

		while(dirArr.length > 0) {
			currDirName = dirArr.shift();
			_currData = _currData.find(findItem);

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
						<div onClick={this.selectItem} className="w-90 h_20px cursor_default">{item.name}</div>
					</li>
					{!!item.directory > 0 ? <li className={subTreeCss}>{this.treeItem(item.directory, currDir)}</li> : null}
				</ul>
			);
		});
	}
	createFolder(closeDia) {
		const { t } = this.props;
		const { storeageType, selectDir, directory } = this.state;
		const currDirInfo = this.getDirectoryInfo(selectDir);
		const targetDir = selectDir.replace(/(\\)$/,'');
		let newDirectory = [];
		const inputDom = document.getElementById('createDirInput');

		inputDom.classList.remove('is-invalid');

		//my-was-validated, is-invalid

		if(!inputDom.checkValidity()) {
			let errMsg = t('validator_required');

			if(inputDom.validity.patternMismatch) {
				errMsg = t('msg_special_characters_folder');
			}

			this.setState({
				newDirErr : errMsg
			},() => {
				inputDom.classList.add('is-invalid');
			});

			return false;
		}

		if(!!currDirInfo.directory) {
			newDirectory = [...currDirInfo.directory];
		}

		newDirectory = [...newDirectory, {
				"name": inputDom.value,
				"subDirectory": false,
				"time": new Date()
			}];

		CREATE_DIRECTORY.fetchData({
			'type': storeageType,
			'directory': selectDir
		}).then(data => {
			if(data.result === 0) {

				this.setState({
					directory : {
						directory : this.updateDirectory(directory.directory, { subDirectory : true, directory : newDirectory, open : true }, targetDir)
					}
				});
	
				closeDia();
				this.props.updateParentState({
					isCreatingFolder : false
				});
			}
		});
	}

	changeCreateInput(e) {
		const inputDom = e.target;
		const { t } = this.props;

		if(!inputDom.checkValidity()) {
			let errMsg = t('validator_required');

			if(inputDom.validity.patternMismatch) {
				errMsg = t('msg_special_characters_folder');
			}

			this.setState({
				newDirErr : errMsg
			});
		}

	}

	deleteFolder(e) {
		const { storeageType, selectDir, directory } = this.state;
		if(e.key !== 'Delete' || selectDir === '\\') {
			return false;
		}

		//TODO: check folder is empty or not

		const { t } = this.props;
		
		const targetDir = selectDir.replace(/(\\)$/,'');
		let dirArr = targetDir.split('\\');
		const targetDirName = dirArr.pop();
		const prevDir = dirArr.join('\\');
		const prevNodeDirInfo = this.getDirectoryInfo(prevDir);
		let newDirectory = [];


		prevNodeDirInfo.directory.forEach(item => {
			if(item.name !== targetDirName) {
				newDirectory.push(item);
			}
		});

		GET_DIRECTORY.fetchData({
			'type': storeageType,
			'directory': selectDir
		}).then(data => {
			if(data.result !== 0) {
				throw new Error(data.result);
			}else{
				if(data.subDirectory || data.file.length > 0) {
					return true;
				}else{
					return false;
				}
			}

		}).then(hasSubFiles => {
			const mainMsg = (hasSubFiles ? t('msg_comfirm_delete_folling_folders') : t('msg_comfirm_delete_single_folders'))

			this.setState({
				isDialogShow : true,
				dialogParams : {
					...this.state.dialogParams,
					icon : 'warning',
					type : 'confirm',
					title: t('msg_delete_folder'),
					mainMsg : mainMsg,
					msg : '',
					ok : () => {
						
						DELETE_DIRECTORY.fetchData({
							'type': storeageType,
							'directory': targetDir
						}).then(data => {
							if(data.result === 0) {
								this.setState({ 
									isDialogShow : false,
									selectDir : '\\',
									directory : {
										directory : this.updateDirectory(directory.directory, { subDirectory : newDirectory.length > 0, directory : newDirectory, open : prevNodeDirInfo.open }, prevDir)
									}
								});

							}

						});

					},
					cancel : () => {
						this.setState({ isDialogShow : false });
					}
				}
			});


			
		})
		.catch(err => {
			//TODO : dialog
			console.log(err);
			this.setState({
				isDialogShow : true,
				dialogParams : {
					mainMsg : this.props.t('msg_delete_folder_error'),
					msg : err
				}
			});
		});

	}

	showList(e) {
		e.preventDefault();
		this.setState({showMenu: true}, () => {
			document.addEventListener('click', this.closeList);
		});
	}
	closeList(e) {
		e.preventDefault();
		let state = {
			showMenu: false
		};
		let isReload = false;

		if(e.target.classList.contains('dropdown-item') && e.target.dataset) {
			state.storeageType = e.target.dataset.value;
			state.selectDir = '\\';
			isReload = true;
			this.props.updatePath(state.selectDir);
			this.props.updateStoreageType(state.storeageType);
			
		}

		this.setState(state, () => {
			document.removeEventListener('click', this.closeList);
			if(isReload) {
				this.initDirectory();
			}
		});
	}

    render() {
        const { t, isCreatingFolder, updateParentState } = this.props;
        const { directory, selectDir, storeageType, storeageList, showMenu, isDialogShow, dialogParams, newDirErr } = this.state;


         // is-invalid, msg_special_characters_folder
        return (
            <div className="">
            	{ !isCreatingFolder ? null : 
					<DialogPortal title={t('msg_add_folder')} ok={this.createFolder} cancel={() => { updateParentState({ isCreatingFolder : false }) }}>
						<div key='body' className="form-group row">
							<label className="w_130px col-auto col-form-label">{t('msg_folder_name')}</label>
							<div className="col">		
								<input type="text" className="form-control" required pattern="[^\\^\|^/^:^?^<^>^*^+^*]*" id="createDirInput" onChange={this.changeCreateInput}/>
								<div className="invalid-inline-feedback">{newDirErr}</div>
							</div>
						</div>
					</DialogPortal>
            	}

            	{
            		!isDialogShow ? null : 
            		<DialogPortal {...dialogParams} ></DialogPortal>            			
            	}

				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<button type="button" className="btn btn-outline-secondary dropdown-toggle" onClick={this.showList}>{RECORD_STORE_DEVICE[storeageType]}</button>
						<div className={`dropdown-menu ${showMenu ? 'd-block' : ''}`}>
							{storeageList.map(type => <button key={type} className="dropdown-item" data-value={type}>{RECORD_STORE_DEVICE[type]}</button>)}
						</div>
					</div>
					<input type="text" className="form-control h_auto bg-white" readOnly aria-label="select Dir" value={selectDir}/>
					{/* <div className="input-group-append">
						<span className="input-group-text">
							<button className="btn_reconvert" type="button" onClick={this.loadDirectory}></button>
						</span>
					</div> */}
				</div>
            	
            	<div className="treeZone border p-1" ref={this.treeZone}>
            		{this.treeItem(directory.directory, '\\')}
            	</div>
			</div>
        );
    }
}


export default compose(
	translate("translation"),
	connect(null, null)
)(FileBrowserTree);



