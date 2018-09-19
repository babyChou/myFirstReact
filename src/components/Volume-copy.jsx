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
			draggerWidth : 12,
			rangeValue : max - min,
			rangeWidth : 0,
			rangeLeft : 0,
			valueText: this.props.value
		};

		this.volumeTube = React.createRef();
		this.dragger = React.createRef();
		this.statusBar = React.createRef();
		this.startDragger = this.startDragger.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.stopDrag = this.stopDrag.bind(this);
		this.changeVal = this.changeVal.bind(this);
		this.updateUIval = this.updateUIval.bind(this);
		this.maxVolume = this.maxVolume.bind(this);
		this.minVolume = this.minVolume.bind(this);
		this.updateDomState = this.updateDomState.bind(this);
		
	}

	// static getDerivedStateFromProps(nextProps, prevState) { //Update init state value relate by props
	// }


	componentDidMount(){
		this.updateDomState();
		
		// domNode.scrollIntoView()

		
		

		// let event = new Event('input', { bubbles: true });
		// // hack React15
		// event.simulated = true;
		// // hack React16 内部定义了descriptor拦截value，此处重置状态
		// let tracker = input._valueTracker;
		// if (tracker) {
		// 	tracker.setValue(lastValue);
		// }
		// input.dispatchEvent(event);

	}

	componentDidUpdate() {
		const { rangeWidth, rangeLeft } = this.state;
		const domNode = ReactDOM.findDOMNode(this.volumeTube.current);
		if(rangeWidth !== domNode.offsetWidth || rangeLeft !== domNode.offsetLeft) {
			// this.updateDomState();
		}
	}

	updateDomState() {
		
		const domNode = ReactDOM.findDOMNode(this.volumeTube.current);

			this.setState({
				rangeWidth : domNode.offsetWidth,
				rangeLeft : domNode.getBoundingClientRect().x //offsetLeft
			}, ()=>{
				this.updateUIval(this.state.valueText);
			});
		
	}

	onDrag(e) {
		const { isDrag, rangeLeft, rangeWidth, draggerWidth, rangeValue } = this.state;
		const currRange = e.pageX - rangeLeft;
		
		if(isDrag && (e.pageX >= rangeLeft) && (e.pageX <= (rangeLeft + rangeWidth))) {
			this.statusBar.current.style.width = currRange + 'px';
			this.dragger.current.style.left = currRange - (draggerWidth/2) + 'px';


			this.setState({
				valueText : Math.round((rangeValue*currRange)/rangeWidth)
			});
		}

		e.stopPropagation();
		e.preventDefault;
	}
	startDragger(e) {
		e.stopPropagation();
		e.preventDefault;


		if(!this.props.disabled) {
			this.setState({
				isDrag : true
			});
		}

		return false;
	}
	stopDrag(e) {
		e.stopPropagation();
		e.preventDefault;
		this.setState({
			isDrag : false
		});
	}
	changeVal(e) {
		const val = Number(e.target.value);
		this.updateUIval(val);

		this.setState({
			valueText : val
		});

		if(isFunction(this.props.onChange)) {
			this.props.onChange(val);
		}
	}
	updateUIval(val) {
		const { rangeWidth, rangeValue, draggerWidth } = this.state;
		let statusWidth = (val*rangeWidth)/rangeValue;
		if(statusWidth > rangeWidth) {
			statusWidth = rangeWidth;
		}
		this.statusBar.current.style.width = statusWidth + 'px';
		this.dragger.current.style.left = statusWidth - (draggerWidth/2)+ 'px';
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
		const { valueText } = this.state;
		const { min, max, disabled } = this.props;
		return (
				<div className="volume_control form-inline">
					<button className="btn_tuner_volume_minimal mr-2" onClick={this.minVolume}></button>
					<div className="volume_control_tube" ref={this.volumeTube} onMouseDown={this.startDragger} onMouseMove={this.onDrag} onMouseUp={this.stopDrag} onMouseLeave={this.stopDrag}>
						<div className="volume_bar_status" ref={this.statusBar}></div>
						<div className="volume_bar_control" ref={this.dragger} ></div>
					</div>
					<button className="btn_tuner_volume_max mx-2" onClick={this.maxVolume}></button>
					<input type="number" className="form-control volume_control_value" min={min} max={max} value={valueText} onChange={this.changeVal} disabled={disabled}/>
				</div>
			)
	}
}
