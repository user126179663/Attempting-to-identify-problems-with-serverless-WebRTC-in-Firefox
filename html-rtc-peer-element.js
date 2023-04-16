class HTMLRTCPeerElement extends HTMLUtilityElement {
	
	static {
		
		this.tagName = 'rtc-peer';
		
		this.$iceCandidate = Symbol('HTMLRTCPeerElement.iceCandidate'),
		
		this.element = {
			fieldset: '#rtc-connection-fieldset',
			state: '#connection-state',
			targetOfferInput: '#remote-offer-input',
			targetAnswerInput: '#remote-answer-input',
			targetIceInput: '#remote-ice-input',
			remoteAnswerApplyButton: '#remote-answer-apply-button',
			remoteOfferApplyButton: '#remote-offer-apply-button',
			offerInput: '#offer-input',
			answerInput: '#answer-input',
			select: '#ice-servers-select',
			iceCopyButton: '#ice-servers-copy-button',
			createAnswerButton: '#create-answer-button',
			createOfferButton: '#create-offer-button',
			addIceButton: '#ice-add-button'
		},
		
		this.bound = [
			this.changedIceConnectionState,
			this.changedTargetAnswer,
			this.changedTargetIce,
			this.changedTargetOffer,
			this.clickedAddIceButton,
			this.clickedCreateAnswerButton,
			this.clickedCreateOfferButton,
			this.clickedIceCopyButton,
			this.clickedRemoteApplyButton,
			this.gatheredIceCandidate,
			this.opened
		],
		
		this.observedAttributeNames = [ ...HTMLUtilityElement.observedAttributeNames, 'roll' ];
		
	}
	
	static clickedAddIceButton() {
		
		const	{ peer, targetIceInput } = this,
				ices = targetIceInput.value && JSON.parse(targetIceInput.value), l = ices?.length;
		
		if (l) {
			
			let i, ice;
			
			i = -1;
			while (++i < l) (ice = ices[i]) && peer.addIceCandidate(ices[i] = new RTCIceCandidate(ice));
			
			this.log('🔗', '"Added ICE Candidates."', peer, ...ices);
			
		}
		
	}
	static changedTargetAnswer(event) {
		
		const { targetAnswerInput, targetOfferInput, peer } = this;
		
		targetOfferInput && (targetOfferInput.disabled = !!targetAnswerInput.value);
		
	}
	static changedTargetIce(event) {
		
		const { peer, targetIceInput } = this;
		
		targetIceInput.value && peer.addIceCandidate(JSON.parse(targetIceInput.value)).catch(error => this.error(error));
		
	}
	static changedTargetOffer(event) {
		
		const { answerInput, peer, targetAnswerInput, targetOfferInput } = this;
		
		targetAnswerInput && (targetAnswerInput.disabled = !!targetOfferInput.value);
		
	}
	static async clickedRemoteApplyButton(event) {
		
		const	{ answerInput, peer, select, targetAnswerInput, targetOfferInput } = this;
		
		if (!targetAnswerInput || targetAnswerInput.disabled) {
			
			await peer.setRemoteDescription(JSON.parse(targetOfferInput.value)).catch(error => this.error(error)),
			
			this.log('📬', '"Set an offer."', JSON.parse(targetOfferInput.value, peer)),
			
			await peer.createAnswer().then(answer => peer.setLocalDescription(answer)).catch(error => this.error(error));
			
			const { localDescription } = peer;
			
			this.log('💍', '"Created an answer."', localDescription),
			
			answerInput.value = JSON.stringify(localDescription);
			
		} else if (!targetOfferInput || targetOfferInput.disabled) {
			
			await peer.setRemoteDescription(JSON.parse(targetAnswerInput.value)).catch(error => this.error(error)),
			
			this.log('📬', '"Set an answer."', peer.remoteDescription);
			
		}
		
	}
	static async clickedCreateOfferButton(event) {
		
		const { offerInput, peer } = this;
		
		await peer.createOffer().then(offer => peer.setLocalDescription(offer)).catch(error => this.error(error));
		
		const { localDescription } = peer;
		
		this.log('💌', '"Created an offer."', localDescription),
		
		offerInput.value = JSON.stringify(localDescription);
		
	}
	static async clickedIceCopyButton(event) {
		
		const { $iceCandidate } = HTMLRTCPeerElement, { select: { options } } = this, l = options.length, str = [];
		let i;
		
		i = -1;
		while (++i < l) str[i] = options[i]?.[$iceCandidate];
		
		l &&	(
					await navigator.clipboard.writeText(i = '[' + str.join() + ']'),
					this.log('🖨', '"Copied ICE candidates."', this.id, JSON.parse(i))
				);
		
	}
	static gatheredIceCandidate(event) {
		
		const { select } = this, { candidate } = event;
		
		if (candidate && select) {
			
			const option = document.createElement('option');
			
			option.value = option.textContent = candidate.candidate || 'An empty',
			option[HTMLRTCPeerElement.$iceCandidate] = JSON.stringify(candidate),
			
			select.appendChild(option),
			
			select.selectedIndex = select.children.length - 1,
			
			this.log('🛰', '"Gathered an ICE candidate."', candidate);
			
		}
		
	}
	static opened(event) {
		
		this.log('🤝', '"Opened, congrats!"', this.peer);
		
		//this.channel.send('hi');
		
	}
	static changedIceConnectionState() {
		
		const { id, peer } = this, { target } = event;
		
		this.log('🎛', '"Changed an ICE connection state."', target),
		
		this.state.textContent = target.iceConnectionState.toUpperCase();
		
		if (target.iceConnectionState === 'failed') {
			
			peer.restartIce(), this.warn('😫', '"Failed to connect."');
			
		}
		
	}
	
	constructor() {
		
		super();
		
		const	peer = this.peer = new RTCPeerConnection(),
				channel = this.channel = peer.createDataChannel('chat');
		
		this.attachEvent(this.remoteAnswerApplyButton, 'click', this.clickedRemoteApplyButton),
		this.attachEvent(this.remoteOfferApplyButton, 'click', this.clickedRemoteApplyButton),
		this.attachEvent(this.targetOfferInput, 'change', this.changedTargetOffer),
		this.attachEvent(this.targetAnswerInput, 'change', this.changedTargetAnswer),
		this.attachEvent(this.iceCopyButton, 'click', this.clickedIceCopyButton),
		this.attachEvent(this.createOfferButton, 'click', this.clickedCreateOfferButton),
		this.attachEvent(this.addIceButton, 'click', this.clickedAddIceButton),
		
		this.attachEvent(channel, 'open', this.opened),
		this.attachEvent(peer, 'icecandidate', this.gatheredIceCandidate),
		this.attachEvent(peer, 'iceconnectionstatechange', this.changedIceConnectionState);
		
	}
	attributeChangedCallback(name, last, current) {
		
		HTMLUtilityElement.prototype.attributeChangedCallback.call(this, name, last, current);
		
		switch (name) {
			
			case 'roll':
			this.fieldset && (current ? (this.fieldset.dataset.roll = current) : delete this.fieldset.dataset.roll);
			break;
			
		}
		
	}
	
	get roll() {
		
		return this.getAttribute('roll');
		
	}
	set roll(v) {
		
		return this.getAttribute('roll', v);
		
	}
	
}

addEventListener
	(
		'DOMContentLoaded',
		() =>	customElements.define(HTMLRTCPeerElement.tagName, HTMLRTCPeerElement),
		{ once: true }
	);