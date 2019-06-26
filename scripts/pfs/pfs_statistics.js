(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsStatisticsCtrl', pfsStatisticsCtrl);
	pfsStatisticsCtrl.$inject = ['$scope'];

	function pfsStatisticsCtrl($scope) {
		var vm = $scope

		$.plot($("#chart"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
		$.plot($("#chart2"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
		$.plot($("#chart3"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
	}

})();