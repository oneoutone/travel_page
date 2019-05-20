(function() {
	'use strict';
	angular
		.module('app')
		.controller('newsAnalyseCtrl', newsAnalyseCtrl);
	newsAnalyseCtrl.$inject = ['$scope', '$stateParams', 'httpService'];

	function newsAnalyseCtrl($scope, $stateParams, httpService) {
		var vm = $scope
		vm.header = {name:'2'};

		vm.app.ready(function(){
			if(!$stateParams.id){
				return
			}
			httpService.article({id: $stateParams.id}, function(r){
				vm.article = r
			}, function(e){
				console.log(e)
			})
		})
	}

})();