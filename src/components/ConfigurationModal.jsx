import * as React from 'react';

const ConfigurationModal = (props) => {
	const { t, id } = props;

	return (
		<div className="modal-content mb-3">
			<div className="modal-header">
				<h6 className="modal-title">
					{t('msg_output') + ' ' + id}
				</h6>
			</div>
			<div className="modal-body">
				{ props.children[0] }
				<div className="table-responsive">
					<table className="table-configuration">
						<thead className="thead-blue">
							<tr className="table-bordered">
								<th scope="col" className="w-5">{t('msg_no')}</th>
								<th scope="col" className="w-10">{t('msg_channel_name')}</th>
								<th scope="col" className="w-15">{t('msg_stream_type')}</th>
								<th scope="col" className="w-25">{t('msg_encoding_profile')}</th>
								<th scope="col" className="w-15">{t('msg_ip_addr')}</th>
								<th scope="col" className="w-5">{t('msg_port')}</th>
								<th scope="col" >{t('msg_network_interface')}</th>
								<th scope="col" colSpan="2"></th>
							</tr>
						</thead>
						<tbody>
							{
								props.children[1]
							}
						</tbody>
					</table>
				</div>
				
			</div>
			<div className="modal-footer"></div>
		</div>
	);
};

export default ConfigurationModal;

