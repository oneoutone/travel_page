(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsIndexCtrl', pfsIndexCtrl);
	pfsIndexCtrl.$inject = ['$scope'];

	function pfsIndexCtrl($scope) {
		$scope.data = {name:'1'};
	}

})();