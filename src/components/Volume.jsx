import * as React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from '../helper/helper';

export default class Volume extends React.Component {
	constructor(props) {
		super(props);
		const max = Number(this.props.max) || 100;
		const min = Number(this.props.min) || 0;

		this.state = {
			isDrag : false,
			rangeValue : max - min,
			valueText: this.props.value,
			draggerStyle : { left: 0 },
			barStyle : { width: 0 },
			draggerWidth : 12,
			rangeWidth : 0,
			rangeLeft : 0
		};

		this.volumeTube = React.createRef();
		this.startDragger = this.startDragger.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.stopDrag = this.stopDrag.bind(this);
		this.changeVal = this.changeVal.bind(this);
		this.updateUIval = this.updateUIval.bind(this);
		this.maxVolume = this.maxVolume.bind(this);
		this.minVolume = this.minVolume.bind(this);
		this.ckRange = this.ckRange.bind(this);
		this.getRangeVal = this.getRangeVal.bind(this);
		this.checkMinMax = this.checkMinMax.bind(this);
		
	}
// 
// 	static getDerivedStateFromProps(nextProps, prevState) { //Update init state value relate by props
// 	}


	componentDidMount(){
		// let event = new Event('input', { bubbles: true });
		// // hack React15
		// event.simulated = true;
		// // hack React16 内部定义了descriptor拦截value，此处重置状态
		// let tracker = input._valueTracker;
		// if (tracker) {
		// 	tracker.setValue(lastValue);
		// }
		// input.dispatchEvent(event);
		
		const domNode = ReactDOM.findDOMNode(this.volumeTube.current);
		this.setState({
			rangeWidth : domNode.offsetWidth,
			rangeLeft : domNode.getBoundingClientRect().x
		},()=>{
			this.updateUIval(this.state.valueText);
		});

	}

	componentDidUpdate(prevProps, prevState) {

		if(this.volumeTube) {
			const domNode = ReactDOM.findDOMNode(this.volumeTube.current);
			if(this.state.rangeWidth !== domNode.offsetWidth || this.state.rangeLeft !== domNode.getBoundingClientRect().x) {

				this.setState({
					rangeWidth : domNode.offsetWidth,
					rangeLeft : domNode.getBoundingClientRect().x
				},()=>{
					this.updateUIval(this.state.valueText);
				});
			}
		}

	}

	ckRange(e) {
		const { rangeLeft, rangeWidth } = this.state;
		return (e.pageX >= rangeLeft) && (e.pageX <= (rangeLeft + rangeWidth));
	}
	getRangeVal(pageX) {
		const { rangeLeft, rangeWidth, rangeValue } = this.state;
		const { min } = this.props;
		const currRange = pageX - rangeLeft;
		const percent = currRange/rangeWidth;

		return min + Math.round(rangeValue*percent);

	}
	onDrag(e) {
		const { isDrag, draggerWidth } = this.state;
		const { limitMin, limitMax } = this.props;
		let { textVal } = this.state;

		if(isDrag && this.ckRange(e)) {
			textVal = this.getRangeVal(e.pageX);

			if(textVal > limitMax) {
					textVal = limitMax;
				}

				if(textVal < limitMin) {
					textVal = limitMin;
				}

			this.updateUIval(textVal);

			this.setState({
				valueText : textVal
			},() =>{
				if(isFunction(this.props.onChange)) {
					this.props.onChange(textVal, this.props.name);
				}
			});
		}
		
		e.stopPropagation();
		e.preventDefault();
	}
	startDragger(e) {
		const { draggerWidth } = this.state;
		const { limitMin, limitMax } = this.props;
		let textVal = this.state.valueText;

		if(!this.props.disabled) {
			if(this.ckRange(e)) {
				textVal = this.getRangeVal(e.pageX);
				if(textVal > limitMax) {
					textVal = limitMax;
				}

				if(textVal < limitMin) {
					textVal = limitMin;
				}

				this.updateUIval(textVal);
			}

			this.setState({
				isDrag : true,
				valueText: textVal
			},() =>{
				if(isFunction(this.props.onChange)) {
					this.props.onChange(textVal, this.props.name);
				}
			});
		}
				

		e.stopPropagation();
		e.preventDefault();
	}
	stopDrag(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({
			isDrag : false
		});
	}
	changeVal(e) {
		const val = Number(e.target.value);

		
		this.setState({
			valueText : val
		});

		
	}
	updateUIval(val) {
		const { min } = this.props;
		const { draggerWidth, rangeWidth, rangeValue } = this.state;
		let statusWidth = (Math.abs(min - val)*rangeWidth)/rangeValue;
		if(statusWidth > rangeWidth) {
			statusWidth = rangeWidth;
		}

		this.setState({
			draggerStyle : { left:statusWidth - (draggerWidth/2) },
			barStyle: { width: statusWidth }
		});

	}
	checkMinMax(e) {
		let val = Number(e.target.value);
		const { min, max, limitMin, limitMax } = this.props;
		if(val > max) {
			val = max;
		}
		if(val > limitMax) {
			val = limitMax;
		}

		if(val < min){
			val = min;
		}

		if(val < limitMin){
			val = limitMin;
		}

		this.setState({
			valueText : val
		});

		this.updateUIval(val);
		if(isFunction(this.props.onChange)) {
			this.props.onChange(val, this.props.name);
		}

	}
	maxVolume(e) {
		const val = this.props.max;
		this.updateUIval(val);
		this.setState({
			valueText : val
		});

	}
	minVolume(e) {
		const val = this.props.min;
		this.updateUIval(val);
		this.setState({
			valueText : val
		});
	}
	render() {
		const { valueText, draggerStyle, barStyle } = this.state;
		const { min, max, disabled, btnMinMax, size } = this.props;
		let tubeSize = {};

		switch(size) {
			case 'sm': 
				tubeSize.width = '9rem';
				break
			case 'lg': 
				tubeSize.width = '13rem';
				break
			default:
				tubeSize.width = '11rem';
				break
		}

		return (
				<div className="volume_control d-inline">
					{ btnMinMax === false ? '' : <button className="btn_tuner_volume_minimal align-middle" disabled={disabled} onClick={this.minVolume}></button> }
					<div className="volume_control_tube mx-2 align-middle" style={tubeSize} ref={this.volumeTube} onMouseDown={this.startDragger} onMouseMove={this.onDrag} onMouseUp={this.stopDrag} onMouseLeave={this.stopDrag}>
						<div className="volume_bar_status" style={barStyle}></div>
						<div className="volume_bar_control" style={draggerStyle}></div>
					</div>
					{ btnMinMax === false ? '' : <button className="btn_tuner_volume_max mr-2 align-middle" disabled={disabled} onClick={this.maxVolume}></button> }
					<input type="number" className="form-control volume_control_value align-middle" min={min} max={max} value={valueText} onChange={this.changeVal} onBlur={this.checkMinMax} disabled={disabled}/>
				</div>
			)
	}
}
