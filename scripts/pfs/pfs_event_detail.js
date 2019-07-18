(function() {
    'use strict';
    angular
        .module('app')
        .controller('EventDetailCtrl', EventDetailCtrl);
    EventDetailCtrl.$inject = ['$scope', '$stateParams', 'httpService', '$state'];

    function EventDetailCtrl($scope, $stateParams, httpService, $state) {
        var vm = $scope
        vm.eventId = $stateParams.eventId
        vm.event = {}
        vm.page = 1
        vm.size = 10
        vm.header = {name:'10'}

        vm.fetchData = function(){
            httpService.eventArticleList({eventId: vm.eventId , size: 10, page: vm.page}, function(data){
                vm.list = data
                for(var i=0; i<vm.list.length; i++){
                    if(vm.list[i].content.length > 100){
                        vm.list[i].content = vm.list[i].content.substr(0, 100)+'...'
                    }
                    if(!vm.list[i].content && vm.list[i].title){
                        vm.list[i].content = vm.list[i].title
                    }
                }
            }, function(err){
                console.log(err)
            })

            httpService.eventArticleCount({eventId: vm.eventId}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
            }, function(err){
                console.log(err)
            })
        }

        vm.fetchEvent = function(){
            httpService.eventById({id: vm.eventId}, function(r){
                vm.event = r
                getCount(vm.event)
            }, function(err){
                console.log(err)
            })
        }

        function getCount(item){
            httpService.eventArticleCount({eventId: item.id}, function(r){
                item.count = r.count
            }, function(e){
                console.log(r)
            })
        }

        vm.doFilter = function(){
            $state.go('app.pfs_event_detail', {page: 1, filter: vm.filter})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            vm.page = vm.bigCurrentPage
            vm.fetchData()
        };


        vm.app.ready(function(){
            vm.fetchEvent()
            vm.fetchData()
        })
    }

})();