import * as React from 'react';
import WindowModal from "./WindowModal";

const Token = (props) => {
	const uri = new URL(window.location.href);

	// console.log(uri.searchParams.get('code'));
	window.addEventListener('message', e => {
		if(e.data.key) {
			
			e.source.postMessage({
				key : e.data.key,
				code : uri.searchParams.get('code')
			},  e.origin);
			
		}

	}, false);

	return (
		<div className="d-flex justify-content-center m-4">
			<div className="w-50">			
				<WindowModal title="Login Success">
					<h3>Login Success</h3>
				</WindowModal>
			</div>
		</div>
		);
};

export default Token;