import * as React from 'react';
import i18n from '../i18n';
import { Alert } from 'reactstrap';

function getUrlVars(uri)
{
        var vars = {}, hash;
        var hashes = uri.slice(uri.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
                hash = hashes[i].split('=');
                vars[hash[0]] = hash[1];                 
        }
        return vars;
}



const Token = (props) => {
	const urlVars = getUrlVars(window.location.href);

	window.addEventListener('message', e => {
		if(e.data.key) {
			e.source.postMessage({
				key : e.data.key,
				...urlVars
			},  e.origin);
			
		}

	}, false);

	return (

		<Alert className="m-5">
			<h3>{i18n.t('translation:msg_success')}</h3>
			<pre>
			{
				JSON.stringify(urlVars, null, 2)
			}
			</pre>
		</Alert>
	);
};

export default Token;