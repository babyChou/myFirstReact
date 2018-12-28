import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { translate } from "react-i18next";

import Header from './Header';
import WindowModal from './WindowModal';
import Dialog from "./Dialog";
import Btn from './Btn';
import FileBrowserTree from "./FileBrowserTree";

import { RECORD_STORE_DEVICE } from "../constant/Common.Consts";
import { GET_STORE_DEVICE_LIST, GET_DIRECTORY } from "../helper/Services";

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

export class FileBrowser extends React.Component {
	constructor(props) {
		super(props);

        this.state = {
        	dir: '\\keyaki\\',
        	file : [],
        	storeageType : '',
        	storeageList : [],
        	isSelectDialogShow : false,
        	isCreatingFolder : false
        }
		this.path = '\\keyaki\\';
        this.updatePath = this.updatePath.bind(this);
        this.updateState = this.updateState.bind(this);
        this.ok = this.ok.bind(this);
        this.cancel = this.cancel.bind(this);
        this.reflashStorage = this.reflashStorage.bind(this);
        this.newFolder = this.newFolder.bind(this);
        this.customFooter = this.customFooter.bind(this);
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
			'directory':this.path
		}).then(data => {
			if(data.result === 0) {

				this.setState({
					file : data.file
				});
			}
		});
	}
	ok() {
		this.loadFiles();
		this.setState({
			dir : this.path,
			isSelectDialogShow : false
		});
	}

	cancel() {
		this.setState({isSelectDialogShow : false});
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
    render() {
        const { t } = this.props;
        const { storeageType, isSelectDialogShow, dir, file, storeageList, isCreatingFolder } = this.state;


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
										<button type="button" className="btn_delete" disabled=""></button>
									</li>
									<li className="list-inline-item mr-4">
										<button type="button" className="btn_add" disabled="" onClick={()=> this.setState({isCreatingFolder : true})}></button>
									</li>
									
								</ul>
								<div className="table-responsive">
									<table className="table-configuration w-100">
										<thead className="thead-blue">
											<tr className="table-bordered">
												<th scope="col" className="text-center w_85px"><input type="checkbox" name="" id=""/></th>
												<th scope="col" className="text-center">{t('msg_name')}</th>
												<th scope="col" className="text-center">{t('msg_video_format')}</th>
												<th scope="col" className="text-center w_300px">{t('msg_date')}</th>
												<th scope="col" className="text-center ">{t('msg_length')}</th>
												<th scope="col" className="text-center w_85px">{t('msg_size')}</th>
											</tr>
										</thead>
										<tbody>
											{
												file.map((item,i) => {
													
													return (
														<tr key={i} className="table-common-odd table-bordered">
															<td className="align-middle text-center"><input type="checkbox" name="" id=""/></td>
															<td className="align-middle">
																<img className="w_130px mr-2" src={item.thumbnail} alt=""/>
																<span>{item.name}</span>
															</td>
															<td className="align-middle">
																{
																	item.videoCodec ? 
																		<div>
																			<i className="icon_media d-inline-block mr-2"></i> {item.videoCodec}
																		</div> 
																	: null
																}
																{
																	item.audioCodec ? 
																		<div>
																			<i className="icon_sound d-inline-block mr-2"></i>
																			{item.audioCodec }
																		</div>
																	
																	: null
																}
															</td>
															<td className="align-middle text-center">{item.time}</td>
															<td className="align-middle text-center"></td>
															<td className="align-middle text-center">{item.size}</td>
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
						<FileBrowserTree path={dir} storeageType={storeageType} updatePath={this.updatePath} isCreatingFolder={isCreatingFolder} updateParentState={this.updateState}></FileBrowserTree>
					</Dialog>
					{/* <Dialog type="confirm" isShow={isCreatingFolder} zIndex="1051" backdropZindex="1050"   title={t('msg_time_setting')} msg={t('msg_time_restart')}></Dialog> */}
				</div>
			</div>
        );
    }
}

/* export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileBrowser); */

export default compose(
	translate("translation"),
	connect(null, null)
)(FileBrowser);



