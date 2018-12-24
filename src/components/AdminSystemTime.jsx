import * as React from "react";
import { translate } from "react-i18next";
import { GET_SYSTEM_TIME, SET_SYSTEM_TIME } from "../helper/Services";
import { WEEKDAYS_SHORT, MONTHS, WEEKDAYS_LONG } from "../constant/Common.Consts";
import { TIMEZONE_LIST } from "../constant/Timezone.Consts";
import { randomID } from "../helper/helper";
import Moment from 'moment';
import Btn from './Btn';
import Dialog from "./Dialog";
import Loader from "./Loader";
import YearMonthForm from "./AdminSystemTimeYearMonthForm";

import { DayPicker } from 'react-day-picker';
import '../styles/_dayPicker.scss';

// http://react-day-picker.js.org/examples/elements-year-navigation
const currentYear = new Date().getFullYear();
const fromMonth = new Date(1970, 0);
const toMonth = new Date(currentYear + 10, 11);

const arr24 = Array.from(new Array(24),(val,index) => index);
const array60 = Array.from(Array(60).keys());


class AdminSystemTime extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDay : new Date(),
			month: fromMonth,
			timezoneID: 1,
			hour: 0,
			minute: 0,
			second: 0,
			counter: 0,
			counterShow : false,
			isDialogShow : false,
			isSubDialogShow : false
		};

		this.namePrefix = randomID();
		this.timer = undefined;
		this.counterTimer = undefined;

		this.changeVal = this.changeVal.bind(this);
		this.toogleDia = this.toogleDia.bind(this);
		this.openDia = this.openDia.bind(this);
		this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
		this.handleDayClick = this.handleDayClick.bind(this);
		this.renderYearMonth = this.renderYearMonth.bind(this);
		this.updateDisplayTime = this.updateDisplayTime.bind(this);

	}
	componentDidMount() {
		GET_SYSTEM_TIME.fetchData().then(data => {
			
			if(data.result === 0) {
				const deviceTime = data.time;
				const displayTime = new Date(deviceTime.year, deviceTime.month, deviceTime.day, deviceTime.hour, deviceTime.minute, deviceTime.second);

				this.setState({ 
					selectedDay: displayTime,
					month : displayTime,
					hour : deviceTime.hour,
					minute : deviceTime.minute,
					second : deviceTime.second,
					timezoneID: deviceTime.timezoneid,
					utcDiff: deviceTime.timezone
				});

				this.updateDisplayTime();
			}
		});

	}
	handleDayClick(day) {
		this.setState({ selectedDay: day });
	}
	handleYearMonthChange(month) {
	    this.setState({ month });
	}
	ok() {
		const { selectedDay, timezoneID, hour, minute, second } = this.state;
		let sec = 180;

		SET_SYSTEM_TIME.fetchData({
			time : {
				year : selectedDay.getFullYear(),
				month : selectedDay.getMonth(),
				day : selectedDay.getDate(),
				hour : hour,
				minute : minute,
				second : second,
				timezoneid : timezoneID,
				timezone : TIMEZONE_LIST.find(tz => tz.id === timezoneID).utcDiff,
			}
		}, 'POST').then(data => {
			if(data.result === 0) {

				this.setState({
					isSubDialogShow : false,
					isDialogShow : false,
					counterShow : true,
					counter : sec
				});

				this.counterTimer = setInterval((() => {

					this.setState({
						counter : sec --
					});

					if(sec === 0) {
						window.location.reload();
					}

				}).bind(this), 1000);

				
			}


		});
	}
	changeVal(e) {
		const attrName = e.target.name.replace(`${this.namePrefix}_`,'');
		const val = Number(e.target.value);
		let updateData = {
			[attrName] : val
		};


		this.setState(updateData);
	}
	toogleDia(type) {
		let fun = undefined;
		if(type === 'main') {
			fun = function() {
				this.setState({
					isDialogShow: !this.state.isDialogShow
				});
			};
		}else{
			fun = function() {
				this.setState({
					isSubDialogShow: !this.state.isSubDialogShow
				});
			}
		}

		return fun.bind(this);
	}
	openDia() {
		const { selectedDay } = this.state;
		this.setState({
			month : selectedDay,
			hour : selectedDay.getHours(),
			minute : selectedDay.getMinutes(),
			second : selectedDay.getSeconds(),
			isDialogShow: true
		});
	}
	renderYearMonth({ date, localeUtils }) {
		const { language } = this.props;
		if(language === 'en') {
			return <YearMonthForm fromMonth={fromMonth} toMonth={toMonth} months={localeUtils.getMonths()} date={date} localeUtils={localeUtils} onChange={this.handleYearMonthChange} />;
		}else{
			return <YearMonthForm fromMonth={fromMonth} toMonth={toMonth} months={MONTHS[language]} date={date} localeUtils={localeUtils} onChange={this.handleYearMonthChange} />;

		}
	}
	updateDisplayTime() {
		if(this.timer !== undefined) {
			clearTimeout(this.timer);
		}
		const { selectedDay } = this.state;

		this.timer = setTimeout(()=>{
			this.setState({
				selectedDay : new Date(selectedDay.getTime() + 1000)
			});
			this.updateDisplayTime();
		},1000);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		clearInterval(this.counterTimer);
	}
	
	
	render() {
		const { t, language } = this.props;
		const { selectedDay, isDialogShow, isSubDialogShow, counterShow, counter, timezoneID, hour, minute, second } = this.state;

		return (
			<fieldset >
				<div className="d-flex flex-row">
					<div className="conmmon_title_w">{t('msg_current_system_time')}</div>
					{ `(GMT${TIMEZONE_LIST.find(tz => tz.id === timezoneID).utcDiff})  ${Moment(selectedDay).format('YYYY/MM/DD h:mm:ss A')}`}
					<Btn size="sm" type="submit" onClick={this.openDia} className="float-right ml-3">{t("msg_edit")}</Btn>
				</div>
				<Loader isOpen={counterShow} innerText={ counter + 's'} ></Loader>

				<Dialog type="confirm" ok={ ()=> this.setState({isSubDialogShow : true})} isShow={isDialogShow} toggle={this.toogleDia('main')}  title={t('msg_time_setting')} okLabel={t('msg_time_ok')}>
					<div className="border">
						<div className="legend_row font-weight-bold px-2">
							<span className="bg-white py-1 px-2">{t('msg_timezone')}</span>
							
						</div>
						<div className="p-2">
							<select className="form-control" name={`${this.namePrefix}_timezoneID`} onChange={this.changeVal} value={timezoneID}>
								{ TIMEZONE_LIST.map(tz => <option key={tz.id} value={tz.id}>{tz.name}</option>) }
							</select>
						</div>
					</div>
					<div className="border mt-4">
						<div className="legend_row font-weight-bold px-2">
							<span className="bg-white py-1 px-2">{t('msg_date')}</span>
						</div>
						<div className="p-2">
							{
								language === 'en' ? 
								<DayPicker month={this.state.month} fromMonth={fromMonth} toMonth={toMonth} onDayClick={this.handleDayClick} selectedDays={this.state.selectedDay} className="w-100"
									captionElement={this.renderYearMonth}
								></DayPicker> :
								<DayPicker month={this.state.month} fromMonth={fromMonth} toMonth={toMonth} onDayClick={this.handleDayClick} selectedDays={this.state.selectedDay} className="w-100"
									captionElement={this.renderYearMonth} locale={language} weekdaysLong={WEEKDAYS_LONG[language]} weekdaysShort={WEEKDAYS_SHORT[language]}
								></DayPicker>
							}
							
						</div>
					</div>
					<div className="border mt-4">
						<div className="legend_row font-weight-bold px-2">
							<span className="bg-white py-1 px-2">{`${t('msg_time')} (${t('msg_hours')} : ${t('msg_minutes')} : ${t('msg_seconds')})`}</span>
						</div>
						<div className="p-2 d-flex flex-wrap">
							<select name={`${this.namePrefix}_hour`} className="form-control col mr-2" onChange={this.changeVal} value={hour}>
								{arr24.map(hr=>(
									<option key={hr} value={hr}>{hr}</option>
								))}
							</select>
							<select name={`${this.namePrefix}_minute`} className="form-control col mr-2" onChange={this.changeVal} value={minute}>
								{array60.map(hr=>(
									<option key={hr} value={hr}>{hr}</option>
								))}
							</select>
							<select name={`${this.namePrefix}_second`} className="form-control col mr-2" onChange={this.changeVal} value={second}>
								{array60.map(hr=>(
									<option key={hr} value={hr}>{hr}</option>
								))}
							</select>
						</div>
					</div>
					
				</Dialog>

				<Dialog type="confirm" ok={this.ok.bind(this)} isShow={isSubDialogShow} zIndex="1051" backdropZindex="1050" toggle={this.toogleDia('sub')}  title={t('msg_time_setting')} msg={t('msg_time_restart')}></Dialog>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminSystemTime);
