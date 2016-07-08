try {
	var _e = '_e cannnot be used in catch clause';

	try {
		console.log(_e);

		function _e2() {
			try {
				var _e3 = '_e3 cannot be used in catch clause';
				console.log(_e3);
			} catch (_e4) {
				reportError(_e4, 'wrapper/collision/expected.js', '_e2', 6, 1);
				throw _e4;
			}
		}
	} catch (e) {
		e._r = true;

		console.log(e);
	}
} catch (_e5) {
	reportError(_e5, 'wrapper/collision/expected.js', 'top-level code', 1, 0);
}
