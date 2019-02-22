(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsSetCtrl', pfsSetCtrl);
	pfsSetCtrl.$inject = ['$scope'];

	function pfsSetCtrl($scope) {
		$scope.data = {name:'4'};
	}

})();