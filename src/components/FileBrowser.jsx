import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { translate } from "react-i18next";

import Header from './Header';
import WindowModal from './WindowModal';
import Dialog from "./Dialog";
import FileBrowserTree from "./FileBrowserTree";

import { } from "../helper/Services";
import { GET_DIRECTORY } from "../helper/Services";

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
        	isSelectDialogShow : false
        }
		this.path = '\\keyaki\\';
        this.updatePath = this.updatePath.bind(this);
        this.ok = this.ok.bind(this);
	}
	componentDidMount() {

		GET_DIRECTORY.fetchData({
			'type': 0,
			'directory': this.state.dir
		}).then(data => {
			if(data.result === 0) {

				this.setState({
					file : data.file
				});
			}
		});
	}
	updatePath(path) {
		this.path = path;
	}
	loadFiles() {
		GET_DIRECTORY.fetchData({
			'type': 0,
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
    render() {
        const { t } = this.props;
        const { isSelectDialogShow, dir, file } = this.state;


        return (
            <div className="">	
            	<Header noPanel={true}></Header>
            	<div className="mx-3">	
					<WindowModal title={t('msg_file_browser')} >
						<ul className="list-inline">
							<li className="list-inline-item">
								<button type="button" className="btn_delete" disabled=""></button>
							</li>
							<li className="list-inline-item">
								<button type="button" className="btn_add" disabled=""></button>
							</li>
							<li className="list-inline-item">
								<button type="button" className="btn_edit" onClick={()=> this.setState({isSelectDialogShow : true})}></button>
							</li>
							<li className="list-inline-item">
								{dir}
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
					</WindowModal>
					<Dialog type="confirm" ok={this.ok} isShow={isSelectDialogShow} toggle={()=> this.setState({isSelectDialogShow : !isSelectDialogShow})}  title={t('msg_select_remote_path')}>
						<FileBrowserTree path={dir} updatePath={this.updatePath}></FileBrowserTree>
					</Dialog>
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



