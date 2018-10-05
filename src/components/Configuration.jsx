import * as React from "react";
import Header from "./Header";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { configActions } from "../action/Config.Actions";
import { GET_NETWORK_STATUS } from "../helper/Services";
import { concatTasksStatus } from "../helper/helper";
import {
	checkFacilities,
	checkDevicesTasks,
	checkTasksStatus,
	checkEncodeProfiles,
	checkStreamProfiles,
	checkDeviceConfig
} from "../helper/preloader";
import ConfigurationPanel from "./ConfigurationPanel";
import ConfigurationModal from "./ConfigurationModal";
import ConfigurationTabs from "./ConfigurationTabs";
import ConfigurationTasks from "./ConfigurationTasks";

// import Dialog from "./Dialog";

const defaultStreamType = 6;

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
const mapStateToProps = store => ({
	devices: store.configReducer.devices,
	devicesConfig: store.configReducer.devicesConfig,
	devicesTasks: store.configReducer.devicesTasks,
	tasksStatus: store.configReducer.tasksStatus,
	encodeProfiles: store.profiles.encodeProfiles,
	streamProfiles: store.profiles.streamProfiles,
	selectedSource: store.rootReducer.selectedSource
});

const mapDispatchToProps = dispatch => {
	return {
		setDeviceConfig: config => dispatch(configActions.setDeviceConfig(config))
	};
};

class Configuration extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			netWorkStatus: [],
			devicesTasksDetail: [],
			isDeviceConfigSet: false,
			backdropShow: false
		};

		this.addSubTask = this.addSubTask.bind(this);
		this.deleteSubTask = this.deleteSubTask.bind(this);
		this.handleBackdrop = this.handleBackdrop.bind(this);
		this.renewDevicesTasksDetail = this.renewDevicesTasksDetail.bind(this);
	}
	componentDidMount() {
		let reqPromise = [
			checkDevicesTasks(true),
			checkTasksStatus(true),
			checkEncodeProfiles(),
			GET_NETWORK_STATUS.fetchData()
		];
		let reqPromise2 = [];
		let netWorkStatus = [];
		let devicesConfig = [];
		let devices, devicesTasksStatus, encodeProfiles;

		checkFacilities()
			.then(facilities => {
				devices = facilities;

				devices.forEach(device => {
					reqPromise.push(checkDeviceConfig(device.id, true));
				});

				return Promise.all(reqPromise).then(data => {
					const devicesTasks = data[0];
					devicesTasksStatus = concatTasksStatus(
						devicesTasks,
						data[1]
					);
					encodeProfiles = data[2];
					netWorkStatus = data[3]["nic"];

					devicesConfig[1] = data.pop();
					devicesConfig[0] = data.pop();

					devicesTasks.forEach(device => {
						device.tasks.forEach(task => {
							reqPromise2.push(
								checkStreamProfiles(task.streamID, true)
							);
						});
					});

					this.setState({
						isDeviceConfigSet: true
					});

					return Promise.all(reqPromise2).then(data => data);
				});
			})
			.then(data => {
				let streamProfiles = data[data.length - 1];
				let streamInfo = {
					deviceID: -1,
					taskID: -1,
					profileID: encodeProfiles[0]['id'],
					isStart: 0,
					streamStatus: 0,
					id: -1,
					streamType: defaultStreamType,
					nic: 1
				};

				let devicesTasksDetail = devices.map(facility => {
					let tasks = [];
					let config = devicesConfig.find(
						device => device.id === facility.id
					);


					devicesTasksStatus
						.filter(device => device.id === facility.id)
						.forEach(device => {
							tasks = device.tasks.map((task, i) => {
								let streamProfile = streamProfiles.find(
									stream => stream.id === task.streamID
								);

								return {
									deviceID: device.id,
									taskID: task.id,
									profileID: task.profileID,
									isStart: task.isStart,
									streamStatus: task.status,
									...streamProfile
								};
							});
						});

					if (tasks.length === 0) {
						tasks.push(Object.assign({}, streamInfo, {
							deviceID : facility.id
						}));
					}

					return {
						...facility,
						tasks: tasks,
						deviceConfig: config
					};
				});

				this.setState({
					netWorkStatus,
					devicesTasksDetail
				});
			});
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		let isValuesChange = false;
		let devicesTasksDetail = prevState.devicesTasksDetail.map(device => {
			let newConfig = {
				...device.deviceConfig
			};
			nextProps.devicesConfig.forEach(config => {
				if(device.id === config.id) {
					//Check value change
					if(device.hasOwnProperty('deviceConfig') && !!device.deviceConfig) {
						for(let k in config) {
							if(device.deviceConfig[k] !== config[k]) {
								isValuesChange = true;
							}
						}
					}else{
						isValuesChange = true;
					}

					if(isValuesChange) {
						newConfig = {
							...device.deviceConfig,
							...config
						};
					}


				}
			});


			return {
				...device,
				deviceConfig: newConfig
			};
		});

		if(isValuesChange) {
			return {
				devicesTasksDetail
			};
		}else{
			return null;
		}

		
	}

	renewDevicesTasksDetail(taskInfo) {
		const { deviceID, taskID, rowNo, profileID, streamID } = taskInfo;
		const { devicesConfig, tasksStatus, streamProfiles } = this.props;

		let devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			let deviceConfig = devicesConfig.find(facility => deviceID === facility.id);

			if(device.id === deviceID) {

				let tasks = device.tasks.map((task, i) => {
								let _rowNo = i+1;

								let taskStatus = tasksStatus.find(taskStatus => taskStatus.deviceID === deviceID && taskStatus.taskID === taskID);
								let streamProfile = streamProfiles.find(stream => stream.id === streamID);

								if(rowNo === _rowNo) {
									return {
										...task,
										taskID: taskID,
										profileID: profileID, 
										isStart: taskStatus.isStart,
										streamStatus: taskStatus.status,
										id: taskID,
										...streamProfile
									};

								}else{
									return task;
								}

							});

				return {
					...device,
					tasks,
					deviceConfig
				};
			}else{

				return {
					...device,
					deviceConfig
				};
			}

		});

		this.setState({
			devicesTasksDetail
		});

	}


	addSubTask(deviceID) {
		let devicesTasksDetail = [];
		let streamInfo = {
			deviceID: deviceID,
			taskID: -1,
			profileID: this.props.encodeProfiles[0]['id'],
			isStart: 0,
			streamStatus: 0,
			id: -1,
			streamType: defaultStreamType,
			nic: 1
		};

		devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			if (device.id === deviceID) {
				return {
					...device,
					tasks: [...device.tasks, streamInfo]
				};
			} else {
				return device;
			}
		});

		this.setState({
			devicesTasksDetail
		});
	}
	deleteSubTask(deviceID, taskID, rowNo) {
		let devicesTasksDetail = [];
		let newTasks = [];

		devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			if (device.id === deviceID) {
				newTasks = device.tasks.filter(
					(task, i) => task.taskID === taskID && i + 1 === rowNo
				);

				if (newTasks.length === 0) {
					alert(
						`Error deviceID ${deviceID}, taskID ${taskID}, rowNo ${rowNo}`
					);
				}

				return {
					...device,
					tasks: newTasks
				};
			} else {
				return device;
			}
		});

		this.setState({
			devicesTasksDetail
		});
	}
	handleBackdrop(show) {
		this.setState({
			backdropShow: show
		});
	}
	render() {
		const {
			t,
			devices,
			devicesTasks,
			tasksStatus,
			encodeProfiles,
			streamProfiles,
			devicesConfig,
			selectedSource
		} = this.props;
		const {
			netWorkStatus,
			devicesTasksDetail,
			isDeviceConfigSet
		} = this.state;

		return (
			<div className="">
				{ this.state.backdropShow ? ( <div className="modal-backdrop fade show" />) : null }
				{/* <Dialog isShow={this.state.dia} toggle={()=>{this.setState({dia: !this.state.dia })}} icon="error" title="fsdfdf" mainMsg="sdfsdfs" msg="sdfsdf" type="alert" ok={()=>{alert()}}></Dialog> */}
				<Header>
					{isDeviceConfigSet ? (
						<ConfigurationPanel
							devices={devices}
							selectedSource={selectedSource}
							devicesConfig={devicesConfig}
						/>
					) : null}
				</Header>
				<section id="config_panel" className="mx-3">
					{devicesTasksDetail.map(device => {
						let totalTaskCount = device.tasks.length;

						return (
							<ConfigurationModal
								key={device.id}
								t={t}
								id={device.id}
							>
								{
									<ConfigurationTabs
										facility={device}
										t={t}
										id={device.id}
										deviceConfig={device.deviceConfig}
										updateDeviceConfig={this.props.setDeviceConfig}
										renewDevicesTasksDetail={this.renewDevicesTasksDetail}
									/>
								}
								{ device.tasks.map((task, i) => {
									return (
										<ConfigurationTasks
											key={i}
											rowNo={i + 1}
											totalTaskCount={totalTaskCount}
											nics={netWorkStatus}
											videoInputs={device.videoInput}
											selectedSource={selectedSource}
											streamInfo={task}
											encodeProfiles={encodeProfiles}
											addSubTask={this.addSubTask}
											deleteSubTask={this.deleteSubTask}
											handleBackdrop={this.handleBackdrop}
											renewDevicesTasksDetail={this.renewDevicesTasksDetail}
										/>
									);
								})}
							</ConfigurationModal>
						);
					})}
				</section>
			</div>
		);
	}
}

export default compose(
	translate("translation"),
	connect(mapStateToProps, mapDispatchToProps)
)(Configuration);
