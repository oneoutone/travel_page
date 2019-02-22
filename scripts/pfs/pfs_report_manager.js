(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsReportManagerCtrl', pfsReportManagerCtrl);
	pfsReportManagerCtrl.$inject = ['$scope'];

	function pfsReportManagerCtrl($scope) {
		$scope.data = {name:'6'};
	}

})();