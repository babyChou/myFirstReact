import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { translate } from "react-i18next";
import Moment from 'moment';

import Header from './Header';
import WindowModal from './WindowModal';
import Dialog from "./Dialog";
import Btn from './Btn';
import FileBrowserTree from "./FileBrowserTree";
import Loader from './Loader';

import { GET_STORE_DEVICE_LIST, GET_DIRECTORY, DELETE_DIRECTORY } from "../helper/Services";
import { randomID, formatDuration, formatBytes, fireEvent } from "../helper/helper";



const HOSTNAME = 'http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

export class FileBrowser extends React.Component {
	constructor(props) {
		super(props);

        this.state = {
        	dir: '\\',
        	file : [],
        	storeageType : '',
        	storeageList : [],
        	isWaiting : false,
        	isSelectDialogShow : false,
        	isDialogShow : false,
        	isCreatingFolder : false,
        	isDeleteDisabled : true,
        	isDownloadDisabled : true,
        	dialogObj : {}
        }
        this.namePrefix = randomID();
		this.path = this.state.dir;
		this.storeageType = this.state.storeageType;

        this.updatePath = this.updatePath.bind(this);
        this.updateStoreageType = this.updateStoreageType.bind(this);
        this.updateState = this.updateState.bind(this);
        this.ok = this.ok.bind(this);
        this.cancel = this.cancel.bind(this);
        this.reflashStorage = this.reflashStorage.bind(this);
        this.newFolder = this.newFolder.bind(this);
        this.customFooter = this.customFooter.bind(this);
        this.onCheckBox = this.onCheckBox.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
	}
	componentDidMount() {
		this.reflashStorage();
	}
	reflashStorage() {

		GET_STORE_DEVICE_LIST.fetchData().then(data => {
			const  storeageList = data.storeDevices;
			if(data.result === 0) {

				if(storeageList.length > 0) {

					GET_DIRECTORY.fetchData({
						'type': storeageList[0],
						'directory': '\\'
					}).then(data => {
						if(data.result === 0) {

							this.setState({
								storeageList,
								storeageType : storeageList[0],
								dir : '\\',
								file : data.file
							});

							this.storeageType = storeageList[0];
						}
					});
					
				}else{

					this.setState({
						storeageType : '',
						dir : '\\',
						file : [],
						storeageList : data.storeDevices
					});
				}

			}
		})

	}
	updateStoreageType(type) {
		this.storeageType = type;
	}
	updatePath(path) {
		this.path = path;
	}
	updateState(state) {
		this.setState({
			...state
		});
	}
	loadFiles() {
		GET_DIRECTORY.fetchData({
			'type': this.storeageType,
			'directory': this.state.dir
		}).then(data => {
			if(data.result === 0) {

				this.setState({
					file : data.file
				});
			}
		});
	}
	ok() {

		this.setState({
			dir : this.path,
			storeageType : this.storeageType,
			isSelectDialogShow : false
		}, () => {
			this.loadFiles();
		});
	}

	cancel() {
		const { dir, storeageType } = this.state;

		GET_STORE_DEVICE_LIST.fetchData().then(data => {
			if(data.result === 0) {
				const  storeageList = data.storeDevices;

				if(storeageList.length > 0 && storeageList.includes(storeageType)) {
					this.path = dir;
					this.storeageType = storeageType;
				}else if(data.storeDevices.length === 0) {
					this.setState({
						storeageType : '',
						dir : '\\',
						file : [],
						storeageList : []
					});

				}else if(!storeageList.includes(storeageType)) {
					this.setState({
						storeageType : storeageList[0],
						dir : '\\',
						file : [],
						storeageList : storeageList
					}, () => {
						this.loadFiles();
					});
				}
			}
		});
		
		this.setState({
			isSelectDialogShow : false
		});
	}
	newFolder() {
		this.setState({isCreatingFolder : true});
	}
	customFooter() {
		const { t } = this.props;

		return (
			<React.Fragment>
				<Btn onClick={this.newFolder} className="mt-1" style={{marginRight: 'auto'}}>{t('msg_new_folder')}</Btn>
				<Btn onClick={this.ok} className="mt-1">{t('msg_ok')}</Btn>
				<Btn onClick={this.cancel} className="mt-1">{t('msg_cancel')}</Btn>
			</React.Fragment>
		);

	}
	onCheckBox(e) {
		const currDom = e.target;
		let checkCount = 0;
		if(!!currDom.id && !!currDom.id.match('itemAll')) {
			document.querySelectorAll(`input[name="item_${this.namePrefix}"]`).forEach(el => {
				el.checked = currDom.checked;
			});
		}else{
			const isCheckAll = document.querySelectorAll(`input[name="item_${this.namePrefix}"]:checked`).length === this.state.file.length;
			document.querySelector(`#itemAll_${this.namePrefix}`).checked = isCheckAll;
		}

		checkCount = document.querySelectorAll(`input[name="item_${this.namePrefix}"]:checked`).length;

		this.setState({
			isDeleteDisabled : checkCount === 0,
			isDownloadDisabled : checkCount === 0
		});

	}
	deleteFile(e) {
		const { t } = this.props;
		const { dir, storeageType } = this.state;
		let filesName = [];
		let i = 0;

		document.querySelectorAll(`input[name="item_${this.namePrefix}"]:checked`).forEach(el => {
			filesName.push(el.value);
        });

        this.setState({
			isDialogShow : true,
			dialogObj : {
				title : t('msg_confirm_delete_files'),
				mainMsg : t('msg_comfirm_delete_folling_files'),
				icon: 'warning',
				msg : filesName.map(name => <p key={name} className="d-inline-block mr-2">{name} , </p>),
				ok : (() => {
					this.setState({
						isDialogShow : false,
						isWaiting : true
					});

					(function _deleteFile(filePath){
						
						DELETE_DIRECTORY.fetchData({
							'type': storeageType,
							'directory': filePath
						}).then(data => {
							if(data.result === 0) {
								i++;
								if(!!filesName[i]) {
									(_deleteFile.bind(this))(dir + filesName[i]);
								}else{
									this.setState({
										isWaiting : false
									},() => {
										document.querySelector(`#itemAll_${this.namePrefix}`).checked = false;
									});
									this.loadFiles();
								}
							}else{
								alert(`Delete File ${filePath} error. Result : ${data.result}`);
							}
						});

					}).bind(this)(dir + filesName[i]);

					
				}).bind(this),
				cancel : (() => { this.setState({ isDialogShow : false }); }).bind(this),
			}
        });

	}
	downloadFile(e) {
		const { dir, storeageType } = this.state;
		let download = document.createElement('a');

        document.querySelectorAll(`input[name="item_${this.namePrefix}"]:checked`).forEach(el => {
        	(fileName => {
        		download.href = `${HOSTNAME}/${storeageType}/${dir.replace(/[\\]/g,'\/')}${fileName}`;
        		download.download = fileName;
        		fireEvent(download, 'click');
        	})(el.value);
        });
        
        // console.log(HOSTNAME, storeageType,dir);
		
	}
    render() {
        const { t } = this.props;
        const { storeageType, isSelectDialogShow, isDialogShow, dir, file, storeageList, isCreatingFolder, isDownloadDisabled, isDeleteDisabled, dialogObj, isWaiting } = this.state;


        return (
            <div className="">	
            	<Header noPanel={true}></Header>
            	<div className="mx-3">	
					<WindowModal title={t('msg_file_browser')} >
						{
							storeageList.length === 0 ? 
							<div className="d-flex justify-content-center align-items-center">
								<h4 className="text-secondary px-2 pt-2">{t('msg_store_device_refresh_tip')}</h4><button type="button" className="btn_common" onClick={this.reflashStorage}><p>{t('msg_refresh')}</p></button>
							</div> :
							<React.Fragment>
								<ul className="list-inline">
									<li className="list-inline-item">
										<div className="text-capitalize">{t('msg_store_device')} :</div>
									</li>
									<li className="list-inline-item">
										<span className="d-inline-block  mr-2">{storeageType + ': ' + dir}</span>
										<button type="button" className="btn_edit d-inline-block align-top" onClick={()=> this.setState({isSelectDialogShow : true})}></button>
									</li>
								</ul>
								<ul className="list-inline">
									<li className="list-inline-item">
										<button type="button" className="btn_delete" disabled={isDeleteDisabled} onClick={this.deleteFile}></button>
									</li>
									<li className="list-inline-item mr-4">
										<button type="button" className="btn_add" disabled={isDownloadDisabled} onClick={this.downloadFile}></button>
									</li>
									
								</ul>
								<div className="table-responsive">
									<table className="table-configuration w-100">
										<thead className="thead-blue">
											<tr className="table-bordered">
												<th scope="col" className="text-center w_85px"><input type="checkbox" id={`itemAll_${this.namePrefix}`} onChange={this.onCheckBox}/></th>
												<th scope="col" className="text-center w_500px">{t('msg_file_name')}</th>
												<th scope="col" className="text-center">{t('msg_file_video_format')}</th>
												<th scope="col" className="text-center w_300px">{t('msg_date')}</th>
												<th scope="col" className="text-center ">{t('msg_length')}</th>
												<th scope="col" className="text-center">{t('msg_size')}</th>
											</tr>
										</thead>
										<tbody>
											{
												file.map((item,i) => {
													const time = Moment(item.time*1000).format('YYYY/MM/DD h:mm:ss A');	
													
													return (
														<tr key={i} className="table-common-odd table-bordered">
															<td className="align-middle text-center"><input type="checkbox" name={`item_${this.namePrefix}`} value={item.name} onChange={this.onCheckBox}/></td>
															<td className="align-middle">
																<img className="w_130px mr-2" src={ HOSTNAME + item.thumbnail } alt=""/>
																<span>{item.name}</span>
															</td>
															<td className="align-middle">
																{
																	item.videoInfo ? 
																		<div>
																			<i className="icon_media d-inline-block mr-2"></i> {item.videoInfo}
																		</div> 
																	: null
																}
																{
																	item.audioInfo ? 
																		<div>
																			<i className="icon_sound d-inline-block mr-2"></i>
																			{item.audioInfo }
																		</div>
																	
																	: null
																}
															</td>
															<td className="align-middle text-center">{time}</td>
															<td className="align-middle text-center">{formatDuration(item.duration)}</td>
															<td className="align-middle text-center">{formatBytes(item.size*1048576)}</td>
														</tr>
													);
												})
											}
										</tbody>
									</table>
								</div>
							</React.Fragment>
						}

					</WindowModal>
					
					<Dialog type="confirm" ok={this.ok} isShow={isSelectDialogShow} toggle={()=> this.setState({isSelectDialogShow : !isSelectDialogShow})} title={t('msg_select_remote_path')} customFooter={this.customFooter()}>
						<FileBrowserTree path={dir} storeageType={storeageType} updatePath={this.updatePath} updateStoreageType={this.updateStoreageType} isCreatingFolder={isCreatingFolder} updateParentState={this.updateState}></FileBrowserTree>
					</Dialog>
					<Dialog type="confirm" isShow={isDialogShow} zIndex="1051" backdropZindex="1050" {...dialogObj} ></Dialog>
					<Loader isOpen={isWaiting}></Loader>
				</div>
			</div>
        );
    }
}

export default compose(
	translate("translation"),
	connect(null, null)
)(FileBrowser);



