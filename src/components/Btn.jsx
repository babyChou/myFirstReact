import * as React from 'react';

const Btn = (props) => {
	const attr = Object.assign({
		className : ''
	}, props);
	
	attr.className += ' btn_common';
	if(attr.size) {
		attr.className += ' btn_common_' + props.size;
	}

	delete attr.size;
	delete attr.children;

	return (<button type="button" {...attr}><p>{props.children}</p></button>);
};

export default Btn;