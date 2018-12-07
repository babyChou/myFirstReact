import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { translate } from "react-i18next";
import { SET_CONFIG, LOGOUT } from '../helper/Services';
import { configActions } from '../action/Config.Actions';
import { connect } from "react-redux";
import { compose  } from 'redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import i18n from "../i18n";
import { deleteCookie } from '../helper/helper';
import { USER } from '../constant/User.Consts';


const languageEmu = {
	'en': 'English',
	'zh_tw': '繁體中文',
	'zh_cn': '简体中文'
};

const mapStateToProps = store => (
	{ 
		config: store.configReducer.config
	}
);

const mapDispatchToProps = (dispatch) => {
	return { 
		setConfig: (config) => dispatch(configActions.setConfig(config))
	};
}

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			language: languageEmu[props.config.language],
			collapse: true,
			dropdownOpen: false,
			pannelStyle : {}
		};

		this.changeLang = this.changeLang.bind(this);
		this.panelCollapse = this.panelCollapse.bind(this);
		this.toggleDropDown = this.toggleDropDown.bind(this);

	}


	changeLang(langCode, lang) {

		this.setState({ language: lang});

		SET_CONFIG.fetchData({
			config: {
				language : langCode
			}
		}, 'POST', false).then(data => {

			if(data.result === 0) {
				this.props.setConfig({
					language : langCode
				});
				i18n.changeLanguage(langCode);
			}
		});
	}

	panelCollapse() {

		this.setState({
			collapse : !this.state.collapse
		});

	}
	toggleDropDown(e) {
		this.setState({
			dropdownOpen : !this.state.dropdownOpen
		});
	}

	logout(e) {
		
		LOGOUT.fetchData({}, 'POST', false).then(() => {
			window.name = '';
			deleteCookie(btoa(USER));
			window.location.reload();
		});
	}

	render() {
		const { t, children } = this.props;
		let dropdownRow = [];

		for(let key in languageEmu){
			let name = languageEmu[key];
			dropdownRow.push(<DropdownItem key={dropdownRow.length} tag="span" onClick={() => this.changeLang(key, name)}>{name}</DropdownItem>);
		}

		return (
			<header>
				<section id="header_top" className="head_2">
					<div className="head_1"></div>
					<div className="logo"></div>
					<ul id="menu_config">
						<li className="btn_menu_language" onClick={this.toggleDropDown}>
							<Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
								<DropdownToggle tag="span" >{this.state.language}</DropdownToggle>
								<DropdownMenu className="common-dp-menu"
									modifiers={{
										setMaxHeight:{
											enabled: true,
											fn: (data) => {
												return {
													...data,
													styles: {
														...data.styles,
														left: '-27px'
													}
												};
											}
										}
									}}
								>
								{dropdownRow}
								</DropdownMenu>
							</Dropdown>
						</li>
						<li className="btn_menu_logout" onClick={this.logout}><span>{t('msg_logout')}</span></li>
					</ul>


					<nav id="main_tab">
						<NavLink exact to="/" className="btn_broadcastlist" activeClassName="active"><span>{t('msg_broadcast_list')}</span></NavLink>
						<NavLink to="/configuration" className="btn_configuration" activeClassName="active"><span>{t('msg_configuration')}</span></NavLink>
						<NavLink to="/encoding_profile" className="btn_encoding" activeClassName="active"><span>{t('msg_encoding_profile')}</span></NavLink>
						<NavLink to="/pip" className="btn_pip" activeClassName="active"><span>{t('msg_pip')}</span></NavLink>
						{/* <NavLink to="/log_management" className="btn_log" activeClassName="active"><span>{t('msg_log_management')}</span></NavLink> */}
						{/* <NavLink to="/filebrowser" className="btn_browser" activeClassName="active"><span>{t('msg_file_browser')}</span></NavLink> */}
						<NavLink to="/administration" className="btn_administration" activeClassName="active"><span>{t('msg_administration')}</span></NavLink>
					</nav>
				</section>

				{
					this.props.noPanel ? null :
					<section id="source_panel" style={{ minHeight : ( this.state.collapse ? null : '40px') }}>
						<button type="button" className={'float-right ' + (this.state.collapse ? 'btn_folding' : 'btn_expand') } onClick={this.panelCollapse}></button>
						<div className="source_panel_wrapper" style={{ display : ( this.state.collapse ? null : 'none') }}>
							{ children }
						</div>
					</section>
				}

			</header>
		);
	}
}

export default compose(
	translate('translation'),
	connect(mapStateToProps, mapDispatchToProps)
)(Header);


