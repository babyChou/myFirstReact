import * as React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from '../helper/helper';

export default class Tag extends React.Component {
	constructor(props) {
		super(props);

		let tags;

		if(props.value.trim() !== '') {
			tags = props.value.split(',');
		}

		this.state = {
			tags : tags || [],
			isFocus : false
		};

		this.addTag = this.addTag.bind(this);
		this.deleteTag = this.deleteTag.bind(this);
		this.inFocus = this.inFocus.bind(this);
		this.blur = this.blur.bind(this);
	}
	componentDidMount(){
	}

	componentDidUpdate(prevProps, prevState) {

	}

	inFocus(e) {
		const domNode = ReactDOM.findDOMNode(e.currentTarget);
		domNode.querySelector('.tag_input').focus();
		this.setState({isFocus : true});
	}
	blur(e) {
		const domNodeInput = ReactDOM.findDOMNode(e.currentTarget).querySelector('.tag_input');
		let updateData = {
			isFocus : false
		}

		if(domNodeInput.value !== '') {
			updateData.tags = [
				...this.state.tags,
				domNodeInput.value
			];
		}

		this.setState(updateData, () => {
			domNodeInput.value = '';
		});
	}
	addTag(e) {
		const domNode = ReactDOM.findDOMNode(e.currentTarget);

		if(e.key === 'Enter' && e.target.value !== '') {
			this.setState({
				tags : [
					...this.state.tags,
					e.target.value
				]
			}, () => {
				domNode.value = '';

				if(!!this.props.onChange && isFunction(this.props.onChange)) {
					this.props.onChange(this.state.tags.join(','));
				}
			});


		}
	}
	deleteTag(e, tag) {
		const newTags = this.state.tags.filter((_tag, _i) => tag !== _tag );
		this.setState({
			tags : newTags
		}, () => {

			if(!!this.props.onChange && isFunction(this.props.onChange)) {
				this.props.onChange(this.state.tags.join(','));
			}
		});
	}

	render() {
		const { disabled } = this.props;
		return (
			<div className={'tag ' + (disabled ? 'disabled' : '')} >
				<div className={"tag_wrapper form-control " + (this.state.isFocus ? 'focus' : '')} onClick={this.inFocus} onBlur={this.blur}>
					{
						this.state.tags.map((tag,i) => {
							return (
								<span key={tag + i} className="tag_item badge badge-secondary">
									{tag}
									<i className="tag_item_close ion-md-close-circle-outline" onClick={ e => { this.deleteTag(e, tag) }} ></i>
								</span>
							);
						})
					}
					<input className="tag_input" type="text" onKeyDown={this.addTag}/>
				</div>
			</div>
		);
	}
}
