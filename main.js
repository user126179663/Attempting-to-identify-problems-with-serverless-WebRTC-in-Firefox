addEventListener(
	'load',
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
					{ selectors: [ '#offer', '#create-offer-button' ], type: 'click', note: '動作不良を起こしていると思われる時は恐れ入りますがページを更新して初めからやり直してください。またこのスクリプトではクリップボードへの書き込みを行ないます。クリップボードの中に保持されている情報がありましたら、お手数をおかけしますがあらかじめバックアップをお取りいただくようお願い申し上げます。それではまず最初に"Create Offer"と書かれたボタンを押してください。' },
					{ selectors: [ '#offer', '#offer button[for="offer-input"]' ], type: 'click', note: '"Copy"と書かれたボタンを押してください。' },
					{
						selectors: [ '#answer', '#remote-offer-input' ],
						type: 'focus',
						note: 'テキストボックスの中で「貼り付け」をしてください。',
						callback: pastingCallback,
						option: { once: false }
					},
					{ selectors: [ '#answer', '#remote-offer-apply-button' ], type: 'click', note: '"Copy"と書かれたボタンを押してください。' },
					{ selectors: [ '#answer', '#answer button[for="answer-input"]' ], type: 'click', note: '"Copy"と書かれたボタンを押してください。' },
					{
						selectors: [ '#offer', '#remote-answer-input' ],
						type: 'focus',
						note: 'テキストボックスの中で「貼り付け」をしてください。',
						callback: pastingCallback,
						option: { once: false }
					},
					{ selectors: [ '#answer', '#ice-servers-copy-button' ], type: 'click', note: '"Copy All"と書かれたボタンを押してください。' },
					{
						selectors: [ '#offer', '#remote-ice-input' ],
						type: 'focus',
						note: 'テキストボックスの中で「貼り付け」をしてください。',
						callback: pastingCallback,
						option: { once: false }
					},
					{ selectors: [ '#offer', '#remote-answer-apply-button' ], type: 'click', note: '”Apply”と書かれたボタンを押してください。' },
					{ selectors: [ '#offer', '#ice-add-button' ], type: 'click', note: '"Add"と書かれたボタンを押してください。' },
					{ selectors: [ '#result' ], type: 'click', note: 'お疲れ様でした。"' + document.getElementById('result-offer-elapse-label').textContent + '"がどちらも"N/A"以外の文字で止まっていれば終了です。止まるまで10秒以上かかる場合があります。"Attempt Time"の文字が止まると、ツイートへのリンクボタンが現われますので、ご協力くださる際はそれを押してツイートしてくだされば幸いです。ありがとうございました。😊' }
				],
				l = guide.length,
				pointer = document.getElementById('pointer'),
				pointerProgress = pointer.querySelector('#guide-progress'),
				pointerContent = pointer.querySelector('#pointer-content'),
				offer = document.getElementById('offer').peer,
				answer = document.getElementById('answer').peer,
				changedSignalState =	({ target }) => target.signalingState === 'stable' &&
												(target.elapse = Date.now(), target.waiting = setInterval(updateResult, 16, target))
				changedIceState =
					({ target }, rs) => (target.iceConnectionState  === 'new' || target.iceConnectionState  === 'checking') ||
								(clearInterval(target.waiting), updateResult(target), rs()),
				updateResult = peer => {
						let v;
						document.getElementById('result-' + (peer === offer ? 'offer' : 'answer') + '-status').textContent = peer.iceConnectionState,
						v = (''+((Date.now() - peer.elapse) / 1000)).split('.')
						document.getElementById('result-' + (peer === offer ? 'offer' : 'answer') + '-elapse').textContent = v[0] + '.' + (v?.[1] ?? '0').padStart(3, '0') + 's'
					},
				guideEnabler = document.getElementById('guide-handler-checkbox'),
				changedGuideEnabler =
					() => document.body.classList[guideEnabler.checked ? 'add' : 'remove']('display-guide');
		let i,k,v, i0,l0, g, rect,nodeRect, resized, ro,io, elapse, waiting, callback, mo;
		
		guideEnabler.addEventListener('change', changedGuideEnabler),
		changedGuideEnabler(),
		
		answer.addEventListener('signalingstatechange', changedSignalState),
		offer.addEventListener('signalingstatechange', changedSignalState),
		
		Promise.all(
			[
				new Promise(rs => answer.addEventListener('iceconnectionstatechange', event => changedIceState(event, rs))),
				new Promise(rs => offer.addEventListener('iceconnectionstatechange', event => changedIceState(event, rs))),
			]
		).then(() => {
			
			const tweet = document.getElementById('result-tweet');
			
			++pointerProgress.value,
			
			tweet.href =	'https://twitter.com/intent/tweet?' +
								'text=' +
									encodeURI(
										document.getElementById('result-data').textContent.trim().replace(']Offer', '] Offer') +
										' via "' + navigator.userAgent + '"'
									) +
									'&' +
								'in_reply_to=' + '1648390813523775490';
			
		}),
		
		pointer.classList.add('pointer'),
		
		(io = new IntersectionObserver(
			() => {
				
				const dr = document.body.getBoundingClientRect(), pr = pointer.getBoundingClientRect();
				let k,v;
				
				dr.top > pr.top && pointer.style.setProperty('--correction-top', parseInt(dr.top - pr.top) + 'px'),
				dr.left > pr.left && pointer.style.setProperty('--correction-left', parseInt(dr.left - pr.left) + 'px'),
				
				(dr.left + dr.width) < (pr.left + pr.width) &&
					pointer.style.setProperty('--correction-right', parseInt((pr.left + pr.width) - (dr.left + dr.width)) + 'px'),
				(dr.top + dr.height) < (pr.top + pr.height) &&
					pointer.style.setProperty('--correction-bottom', parseInt((dr.top + dr.height) - (pr.top + pr.height)) + 'px');
				
				resized?.();
				
			},
			{ root: document, threshold: 1 })
		).observe(pointer),
		
		i = -1, pointerProgress.max = l;
		while (++i < l) {
			
			i0 = -1, l0 = (g = guide[i]).selectors.length, node = document;
			while (++i0 < l0) node = (node.shadowRoot || node)?.querySelector(g.selectors[i0]);
			
			pointerProgress.value = i,
			pointerContent.textContent = g.note,
			
			resized = () => {
				
				rect = node.getBoundingClientRect();
				for (k in rect) typeof (v = rect[k]) === 'number' && (
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
				
				v = getComputedStyle(pointer, ':before');
				for (k in rect) typeof rect[k] === 'number' && pointer.style.setProperty('--before-' + k, v[k]);
				v = getComputedStyle(pointer, ':after');
				for (k in rect) typeof rect[k] === 'number' && pointer.style.setProperty('--after-' + k, v[k]);
				
				
				
			},
			addEventListener('resize', resized),
			(ro = new ResizeObserver(resized)).observe(node),
			
			(mo = new MutationObserver(() => document.body.classList.contains('display-guide') && resized())).
				observe(document.body, { attributes: true, attributeFilter: [ 'class' ]}),
			
			resized(),
			
			await	new Promise(
										rs =>	node.addEventListener(
													g.type,
													callback =
														typeof g.callback === 'function' ? event => g.callback(event, rs) : rs,
													g.option ??= { once: true }
												)
									),
			
			pointer.style.removeProperty('--correction-bottom'),
			pointer.style.removeProperty('--correction-left'),
			pointer.style.removeProperty('--correction-right'),
			pointer.style.removeProperty('--correction-top'),
			
			removeEventListener(g.type, callback, g.option),
			removeEventListener('resize', resized),
			ro.disconnect(node);
			
		}
		
		pointer.remove();
		
	},
	{ once: true }
);