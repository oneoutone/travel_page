(function() {
	'use strict';
	angular
		.module('app')
		.controller('newsListCtrl', newsListCtrl);
	newsListCtrl.$inject = ['$scope'];

	function newsListCtrl($scope) {
		$scope.data = {name:'2'};
	}

})();