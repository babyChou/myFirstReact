import * as React from 'react';

const Btn = (props) => {
	const attr = Object.assign({
		className : '',
		type : 'button'
	}, props);

	attr.className += ' btn_common';
	if(attr.size) {
		attr.className += ' btn_common_' + props.size;
	}

	delete attr.size;
	delete attr.children;

	return (<button {...attr}><p>{props.children}</p></button>);
};

export default Btn;