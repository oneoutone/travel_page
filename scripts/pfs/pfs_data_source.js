(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsDataSourceCtrl', pfsDataSourceCtrl);
	pfsDataSourceCtrl.$inject = ['$scope'];

	function pfsDataSourceCtrl($scope) {
		$scope.data = {name:'5'};
	}

})();