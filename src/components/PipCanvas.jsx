import * as React from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';

export default class PipCanvas extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width : props.width || 160,
			height : props.height || 90
		};
		
	}

	// static getDerivedStateFromProps(nextProps, prevState) {
	// 	
	// }

	componentDidMount(){}
	componentDidUpdate(prevProps, prevState) {}
	drawPip(width, height, pipConfig) {

		const borderW = 2;
		const sizeRadio = pipConfig.windowSize/100;
		const positionX = pipConfig.windowPosition.x/100;
		const positionY = pipConfig.windowPosition.y/100;
		const mainX = width*positionX;
		const mainY = height*positionY;
		const mainW = width*sizeRadio - borderW;
		const mainH = height*sizeRadio - borderW;
		let mainTxtX = (mainX + (mainW/2)) - (5*sizeRadio);
		let mainTxtY = (mainY + (mainH/2)) - (10*sizeRadio);
		let mainfontSize = 25*sizeRadio;

		// console.log(mainX, mainY, mainW, mainH);
            
            
		return (<React.Fragment>
					<Rect x={1} y={1} width={width - borderW} height={height - borderW} strokeWidth={borderW} stroke="#FFF" />
					<Text x={width/2 - 5} y={height/2 - 10} text="1" fill="#FFF" fontSize="20"></Text>
					<Rect x={mainX} y={mainY} width={mainW + borderW} height={mainH + borderW} strokeWidth={borderW} stroke="#FFF" 
						fillLinearGradientStartPoint={{ x: mainW/2, y: -(10*sizeRadio) }}
			            fillLinearGradientEndPoint={{ x: mainW/2, y: mainH + 15 }}
			            fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
					/>
					<Text x={mainTxtX} y={mainTxtY} text="2" fill="#FFF" fontSize={mainfontSize}></Text>
				</React.Fragment>);
	}
	drawPbp(width, height, pipConfig) {
		const borderW = 2;
		const keepRadio = pipConfig.keepRatio;
		const sizeRadio1 = (100 - pipConfig.windowSize)/100;
		const sizeRadio = pipConfig.windowSize/100;
		let x1 = 2, y1 = 2, w1, h1, txtX1, txtY1;
		let x2 = 2 , y2 = 2,w2, h2, txtX2, txtY2;
		let fontSize1 = 20, fontSize2 = 20;
		let cropW = 0;
		let cropH = 0;
		let cropX = 0;
		let cropY = 0;
		let margin = 0;

		if(keepRadio) {
			w1 = width*sizeRadio1;
			h1 = height*sizeRadio1;

			w2 = width*sizeRadio;
			h2 = height*sizeRadio;
			x2 = w1;
			fontSize2 = 25*sizeRadio;
			fontSize1 = 25*sizeRadio1;

			if(h1 > h2) {
				margin = (height - h1)/2;
				y1 = cropY = margin;
				cropX = x2;
				cropW = w2;
				cropH = h1;
				// y2 = (h1 - h2) + margin;
				y2 = height/2 - h2/2;
				
			}else{
				margin = (height - h2)/2;
				// y1 = (h2 - h1) + margin;
				y1 = height/2 - h1/2;
				cropX = x1;
				cropW = w1;
				cropH = h2;
				y2 = cropY = margin;
				
			}

			txtX1 = (x1 + (w1/2)) - (3*sizeRadio1);
			txtY1 = (y1 + (h1/2)) - (10*sizeRadio1);
			txtX2 = (x2 + (w2/2)) - (3*sizeRadio);
			txtY2 = (y2 + (h2/2)) - (10*sizeRadio);
			y1 += borderW;
			y2 += borderW;

		}else{
			h1 = h2 = height;
			w2 = width*sizeRadio;
			w1 = width - w2;
			x2 = w1;
			txtX1 = (x1 + (w1/2)) - 5;
			txtY1 = (y1 + (h1/2)) - 10;
			txtX2 = (x2 + (w2/2)) - 5;
			txtY2 = (y2 + (h2/2)) - 10;
		}


		
		return (<React.Fragment>
					<Rect x="2" y="2" width={width - borderW} height={height - borderW} strokeWidth={borderW} stroke="#FFF" />
					<Line x={2} y={cropY + borderW} strokeWidth={borderW} points={[0, 0, width - borderW , 0]}  stroke="#FFF" />
					<Line x={2} y={cropY + Math.max(h1, h2) - borderW} strokeWidth={borderW} points={[0, 0, width - borderW , 0]}  stroke="#FFF" />
					{/* <Rect x={cropX} y={cropY + borderW} width={cropW} height={cropH - borderW*2} strokeWidth={borderW} stroke="#FFF" /> */}

					<Rect x={x1} y={y1} width={w1 - borderW} height={h1 - borderW*2} strokeWidth={borderW} stroke="#FFF" />
					
					<Rect x={x2} y={y2} width={w2 - borderW/2} height={h2 - borderW*2} strokeWidth={borderW} stroke="#FFF" 
						fillLinearGradientStartPoint={{ x: w2/2, y: - (10*sizeRadio) }}
			            fillLinearGradientEndPoint={{ x: w2/2, y: h2 + 15 }}
			            fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
					/>

					
					<Text x={txtX1} y={txtY1} text="1" fill="#FFF" fontSize={fontSize1}></Text>
					<Text x={txtX2} y={txtY2} text="2" fill="#FFF" fontSize={fontSize2}></Text>
				</React.Fragment>);
	}
	render() {
		const { width, height } = this.state;
		const isPbp = this.props.pipConfig.isPBP;
		const pipConfig = this.props.pipConfig;

		return (		
				<Stage width={width} height={height}>
					<Layer>
						{
							isPbp ? this.drawPbp(width, height, pipConfig) : this.drawPip(width, height, pipConfig)
						
						}
					</Layer>
				</Stage>
			)
	}
}

