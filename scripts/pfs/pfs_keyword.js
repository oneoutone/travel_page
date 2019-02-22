(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsKeywordCtrl', pfsKeywordCtrl);
	pfsKeywordCtrl.$inject = ['$scope'];

	function pfsKeywordCtrl($scope) {
		$scope.data = {name:'3'};
	}

})();