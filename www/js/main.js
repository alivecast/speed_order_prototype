// base64 encode ---------------------------------------------------------------
function encBase64(str) {
	b64_str = base64.encode(str, 1);
	return b64_str;
}

// base64 decode ----------------------------------------------------------------
function decBase64(b64_str) {
	str = base64.decode(b64_str, 1);
	return str;
}

// JSON encode ------------------------------------------------------------------
function encJson(obj) {
	json = JSON.stringify(obj);
	return json;
}

// JSON decode ------------------------------------------------------------------
function decJson(json) {
	obj = JSON.parse(json);
	return obj;
	// obj.params = value
}

// AES128 encode CBC ------------------------------------------------------------
function encAes(str) {
	var key = CryptoJS.enc.Hex.parse(randPass(32));
	var iv = CryptoJS.enc.Hex.parse(randPass(32));
	var encrypted = CryptoJS.AES.encrypt(str, key, {
		iv : iv
	});
	var enc = {};
	enc['key'] = encrypted.key;
	enc['iv'] = encrypted.iv;
	enc['enc'] = encrypted;
	return enc;
}

// AES128 decode CBC -------------------------------------------------------------
function decAes(str, key, iv) {
	var decrypted = CryptoJS.AES.decrypt(str, key, {
		iv : iv
	});
	var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
	return plaintext;
}

// ランダム文字列 -------------------------------------------------------------
function randPass(length) {
	length = length || '';
	// var rand = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
	var rand = 'abcdef' + '0123456789';
	rand = rand.split('');
	var pass = '';
	for (var i = 0; i < length; i++) {
		pass += rand[Math.floor(Math.random() * rand.length)];
	}
	return pass;
}

// htmlでのGET受け取り -------------------------------------------------------------
function getQuery() {
	if (1 < document.location.search.length) {
		// 最初の1文字(?記号)を除いた文字列を取得する
		var query = document.location.search.substring(1);

		// クエリの区切り記号(&)で文字列を配列に分割する
		var parameters = query.split('&');
		var result = new Object();
		for (var i = 0; i < parameters.length; i++) {
			// パラメータ名とパラメータ値に分割する
			var element = parameters[i].split('=');
			var paramKey = decodeURIComponent(element[0]);
			console.log("paramKey " + paramKey);
			var paramValue = decodeURIComponent(element[1]);
			console.log("paramValue " + paramValue);
			// パラメータ名をキーとして連想配列に追加する
			result[paramKey] = paramValue;
		}
		return result;
	}
	return null;
}

//
function getDate(timestamp) {
	var ts = parseInt(timestamp);
	var d = new Date(ts * 1000);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	return String(year) + '年' + String(month) + '月' + String(day) + '日';
}

function getDateTime(timestamp) {
	var ts = parseInt(timestamp);
	var d = new Date(ts * 1000);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var hour = (d.getHours() < 10 ) ? '0' + d.getHours() : d.getHours();
	var min = (d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
	var sec = (d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
	return String(year) + '年' + String(month) + '月' + String(day) + '日 ' + String(hour) + ':' + String(min) + ':' + String(sec);
}

// 桁区切り
function currency(str) {
	var num = new String(str).replace(/,/g, "");
	while (num != ( num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	return num;
}

// ファイル書込処理
function setFile(fname, jsonObj) {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, write, fail);
	function write(fileSystem) {
		fileSystem.root.getFile(fname, {
			create : true,
			exclusive : false
		}, function(fileEntry) {
			fileEntry.createWriter(function(writer) {
				writer.onwrite = function(evt) {
					console.log("正常に書き込めました。");
				};
				writer.onerror = function(evt) {
					console.log('書き込みに失敗しました。' + evt.toString());
				};
				// 内容を書き込み
				var jsonText = JSON.stringify(jsonObj);
				writer.write(jsonText);
			}, fail);
		}, fail);
	}
}

// // ファイル読込処理
// function getFile(fname) {
	// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, read, fail);
	// function read(fileSystem) {
		// fileSystem.root.getFile(fname, {}, function(fileEntry) {
			// fileEntry.file(function(file) {
				// var reader = new FileReader();
				// reader.onloadend = function(evt) {
					// // ここに読み込み完了後の処理を書く
					// console.log("text: " + evt.target.result);
					// text = evt.target.result;
					// // json = JSON.parse(text);
					// console.log("正常にテキストを読み込みました。");
				// };
				// reader.readAsText(file, "utf-8");
				// // Data URL として読み込む
				// // reader.readAsDataURL(file);
			// }, fail)
		// }, fail);
	// }
// }

// ファイル削除
function delFile(fname) {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile(fname, {
			create : false
		}, function(fileEntry) {
			fileEntry.remove(function() {
				console.log('File removed.');
			}, fail);
		}, fail);
	}, fail);
}

// ファイル操作　error処理
function fail(error) {
	console.log("ファイル処理失敗: " + error.code);
}

// 郵便番号の取得 //////////////////////////////////////////////////////////////////////
function getAddress() {
	var zipcode = $('#ordering\\[customer_zipcode\\]').val();
	$.get('/app/Ordering/get_address?zip=' + zipcode);
}

function setPref(data) {
	$('#ordering\\[customer_pref\\]').val(data);
//	var select = $('#ordering\\[customer_pref\\]');
//	select.val(40);
}
function setAddress(data) {
	$('#ordering\\[customer_address1\\]').val(data);
}

// 合計金額の取得 //////////////////////////////////////////////////////////////////////
function getCarriage(price, carriage, non_carriage_price) {
	var amount = document.getElementById('#order_amount').value;
	var total = (price * amount) + carriage;
	var neoCarriage = carriage;
	if (total >= non_carriage_price){
		total = (price * amount)
		neoCarriage = 0;
	}
	// 桁区切り
	str = String(total);
	var num = new String(str).replace(/,/g, "");
	while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
//	return num;
	// 送料無料を反映
	setCarriage(neoCarriage)
	document.getElementById('#total').innerHTML = num + '円(税込)';
}

function setCarriage(carriage) {
	// 桁区切り
	str = String(carriage);
	var num = new String(str).replace(/,/g, "");
	while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
	if (num = '0' ){
		num = '無料'
	} else {
		num + '円'
	}
	document.getElementById('#carriage').innerHTML = String(num);
}

