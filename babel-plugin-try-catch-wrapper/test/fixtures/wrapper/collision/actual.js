var _e = '_e cannnot be used in catch clause'

try {
	console.log(_e)

	function _e2() {
		var _e3 = '_e3 cannot be used in catch clause'
		console.log(_e3)
	}

} catch (e) {
	console.log(e)
}
