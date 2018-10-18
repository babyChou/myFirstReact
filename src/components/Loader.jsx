import * as React from 'react';

const Loader = (props) => {
	const text = props.text;
	const innerText = props.innerText;
	const isOpen = (props.isOpen === undefined ? true : props.isOpen);

	if(!isOpen) {
		return null;
	}

	return (
		<React.Fragment>
			<div className="loader_container">		
				<div className="loader_center">
					<div className="text-center">
						
						<div className="loader"></div>
						{ innerText ? <h4 className="text-white loader_text_middle">{innerText}</h4> : null }
						{
							text ? <h4 className="text-white text-capitalize loader_text_bottom">{text}</h4> : null 
						}
						
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show" />
		</React.Fragment>
		);
};

export default Loader;