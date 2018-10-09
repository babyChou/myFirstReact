import * as React from "react";

const WindowModal = (props) => {
	return (
		<div className="modal-content mb-3">
			<div className="modal-header">
				<h6 className="modal-title">
					{ props.title }
				</h6>
			</div>
			<div className="modal-body">
				{ props.children }
			</div>
			<div className="modal-footer"></div>
		</div>
	);
};

export default WindowModal;

