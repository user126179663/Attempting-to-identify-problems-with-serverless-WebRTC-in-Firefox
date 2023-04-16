addEventListener(
	'DOMContentLoaded',
	async () => {
		
		const	pastingCallback =	(event, rs) =>	{
																
																const	{ target } = event,
																		pasted =  () => (blurred(), rs()),
																		blurred = () =>	(
																									removeEventListener('paste', pasted),
																									target.removeEventListener('blur', blurred)
																								);
																
																target.addEventListener('blur', blurred),
																addEventListener('paste', pasted, { once: true });
																
															},
				guide = [
					{ selectors: [ '#offer', '#create-offer-button' ], type: 'click', note: '手順を間違えたらお手数をかけしますがページを更新して初めからやり直してください。それではまず最初に"Create Offer"を書かれたボタンをクリックしてください。' },
					{ selectors: [ '#offer', '#offer button[for="offer-input"]' ], type: 'click', note: 'クリックしてください。' },
					{
						selectors: [ '#answer', '#remote-offer-input' ],
						type: 'focus',
						note: 'テキストボックスの中で「貼り付け」をしてください。',
						callback: pastingCallback,
						option: { once: false }
					},
					{ selectors: [ '#answer', '#remote-offer-apply-button' ], type: 'click', note: 'クリックしてください。' },
					{ selectors: [ '#answer', '#answer button[for="answer-input"]' ], type: 'click', note: 'クリックしてください。' },
					{
						selectors: [ '#offer', '#remote-answer-input' ],
						type: 'focus',
						note: 'テキストボックスの中で「貼り付け」をしてください。',
						callback: pastingCallback,
						option: { once: false }
					},
					{ selectors: [ '#answer', '#ice-servers-copy-button' ], type: 'click', note: 'クリックしてください。' },
					{
						selectors: [ '#offer', '#remote-ice-input' ],
						type: 'focus',
						note: 'テキストボックスの中で「貼り付け」をしてください。',
						callback: pastingCallback,
						option: { once: false }
					},
					{ selectors: [ '#offer', '#remote-answer-apply-button' ], type: 'click', note: 'クリックしてください。' },
					{ selectors: [ '#offer', '#ice-add-button' ], type: 'click', note: 'クリックしてください。' },
					{ selectors: [ '#result' ], type: 'click', note: 'お疲れ様でした。"' + document.getElementById('result-offer-elapse-label').textContent + '"がどちらもN/A以外の文字で止まっていれば終了です。Copyボタンをクリックすると結果がクリップボードにコピーされますので、それをご報告くださると幸いです。ご協力ありがとうございました。😊' }
				],
				l = guide.length,
				pointer = document.createElement('div'),
				offer = document.getElementById('offer').peer,
				answer = document.getElementById('answer').peer,
				changedSignalState =	({ target }) => target.signalingState === 'stable' &&
												(target.elapse = Date.now(), target.waiting = setInterval(updateResult, 16, target))
				changedIceState =
					({ target }) => (target.iceConnectionState  === 'new' || target.iceConnectionState  === 'checking') ||
								(clearInterval(target.waiting), updateResult(target)),
				updateResult = peer =>
					(
						document.getElementById('result-' + (peer === offer ? 'offer' : 'answer') + '-status').textContent = peer.iceConnectionState,
						document.getElementById('result-' + (peer === offer ? 'offer' : 'answer') + '-elapse').textContent = ((Date.now() - peer.elapse) / 1000) + 's'
					);
		let i,k,v, i0,l0, g, rect, resized, ro,io, elapse, waiting;
		
		answer.addEventListener('signalingstatechange', changedSignalState),
		answer.addEventListener('iceconnectionstatechange', changedIceState),
		offer.addEventListener('signalingstatechange', changedSignalState),
		offer.addEventListener('iceconnectionstatechange', changedIceState),
		
		pointer.classList.add('pointer'), document.body.appendChild(pointer),
		
		(io = new IntersectionObserver(
			() => {
				
				const dr = document.body.getBoundingClientRect(), pr = pointer.getBoundingClientRect();
				let k,v;
				
				dr.top > pr.top && pointer.style.setProperty('--correction-top', pr.top - dr.top + 'px'),
				dr.left > pr.left && pointer.style.setProperty('--correction-left', pr.left - dr.left + 'px'),
				(dr.left + dr.width) < (pr.left + pr.width) &&
					pointer.style.setProperty('--correction-right', (pr.left + pr.width) - (dr.left + dr.width) + 'px'),
				(dr.top + dr.height) < (pr.top + pr.height) &&
					pointer.style.setProperty('--correction-bottom', (pr.top + pr.height) - (dr.top + dr.height) + 'px');
				
			},
			{ root: document, threshold: 1 })
		).observe(pointer),
		
		i = -1;
		while (++i < l) {
			
			i0 = -1, l0 = (g = guide[i]).selectors.length, node = document;
			while (++i0 < l0) node = (node.shadowRoot || node)?.querySelector(g.selectors[i0]);
			
			pointer.dataset.note = g.note,
			
			resized = (a) => {
				
				rect = node.getBoundingClientRect();
				for (k in rect) typeof (v = rect[k]) === 'number' &&
					(
						pointer.style.setProperty('--last-target-' + k, pointer.style.getPropertyValue('--target-' + k)),
						pointer.style.setProperty('--target-' + k, v + 'px')
					);
				pointer.style.setProperty('--target-offset-left', node.offsetLeft + 'px'),
				pointer.style.setProperty('--target-offset-top', node.offsetTop + 'px');
				
				rect = pointer.getBoundingClientRect();
				for (k in rect) typeof (v = rect[k]) === 'number' &&
					(
						pointer.style.setProperty('--last-' + k, pointer.style.getPropertyValue('--' + k)),
						pointer.style.setProperty('--' + k, v + 'px')
					);
				pointer.style.setProperty('--offset-left', pointer.offsetLeft + 'px'),
				pointer.style.setProperty('--offset-top', pointer.offsetTop + 'px');
				
			},
			addEventListener('resize', resized),
			(ro = new ResizeObserver(resized)).observe(node),
			
			await	new Promise(
										rs =>	node.addEventListener(
													g.type,
													typeof g.callback === 'function' ? event => g.callback(event, rs) : rs,
													g.option ?? { once: true }
												)
									),
			
			removeEventListener('resize', resized),
			ro.disconnect(node);
			
		}
		
		pointer.remove();
		
	},
	{ once: true }
);