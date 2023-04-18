# このスクリプトはなに？
　[WebRTC](https://developer.mozilla.org/ja/docs/Web/API/WebRTC_API) によるサーバーレス P2P 通信の動作確認を行ないます。このスクリプトでは、ピアー間での [SDP](https://developer.mozilla.org/ja/docs/Web/API/WebRTC_API/Protocols#sdp) や [ICE](https://developer.mozilla.org/ja/docs/Web/API/WebRTC_API/Protocols#ice) の情報の交換を入力フォームを通じた手動で行ないます。あくまで確認用なので、通信するのは接続の確立までです。

　WebRTC による通信を行いますが、ページ内に作られたピアー同士でのみ行なわれます。[STUN](https://developer.mozilla.org/ja/docs/Web/API/WebRTC_API/Protocols#stun) サーバーを使うこともないため、インターネットを経由して個人情報などが送信されることはありません。

# 使用方法
　``index.html`` をブラウザーで読み込めば動作を開始します。ページ内で順を追って示される手順を辿ると結果が表示されます。もしご協力いただけるなら、その結果を [@code_zerodivide](https://twitter.com/code_zerodevide) まで送っていただけると助かります。