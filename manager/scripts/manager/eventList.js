(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 2000
                });
        })
        .controller('EventListCtrl', EventListCtrl);

    EventListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function EventListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;

        vm.fetchData = function(){
            httpService.eventList({filter: vm.filter, size: 10, page: vm.page}, function(data){
                vm.list = data
                for(var i=0; i<vm.list.length; i++){
                    getCount(vm.list[i])
                }
            }, function(err){
                console.log(err)
            })

            httpService.eventCount({filter: vm.filter}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
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
            $state.go('app.eventList', {page: 1, filter: vm.filter})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.eventList', {page: vm.bigCurrentPage, filter: vm.filter})
        };

        vm.showAdd = function(){
            vm.event = {}
            $('#addEvent').modal('show')
        }

        vm.save = function(){
            httpService.upsertEvent(vm.event, function(r){
                toastr.success('新建事件成功')
                $('#addEvent').modal('hide')
                vm.fetchData()
            }, function(e){
                toastr.success('新建事件失败')
            })
        }

        vm.app.ready(function(){
            if($stateParams.filter){
                vm.filter = $stateParams.filter
            }else{
                vm.filter=''
            }
            if($stateParams.page){
                vm.page = $stateParams.page
            }else{
                vm.page = 1
            }
            vm.size = 10
            vm.fetchData()
        })
    }
})();
