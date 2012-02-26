
// @ypocat 2012, bsd lic

module.exports.middleware = function(express) {
	return express.static(__dirname + '/../public');
};
