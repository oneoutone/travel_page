(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsDataSourceCtrl', pfsDataSourceCtrl);
	pfsDataSourceCtrl.$inject = ['$scope'];

	function pfsDataSourceCtrl($scope) {
		var vm = $scope;
		vm.data = {name:'5'};
		vm.custom = "no";
	}

})();