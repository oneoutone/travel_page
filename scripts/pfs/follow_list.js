(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                positionClass: 'toast-top-full-width',
                preventOpenDuplicates: true,
                timeOut: 1000
            });
        })
        .controller('FollowListCtrl', FollowListCtrl);
    FollowListCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

    function FollowListCtrl($scope, httpService, toastr, $stateParams, $state) {
        var vm = $scope
        vm.header = {name:'9'};
        if($stateParams.page){
            vm.page = $stateParams.page
        }else{
            vm.page = 1
        }

        function fetchData(){
            httpService.followCountByUserId(function(result){
                vm.bigTotalItems = result.count
                vm.bigCurrentPage = vm.page
            }, function(e){
                console.log(e)
            })

            httpService.followListByUserId({size: 10, page: vm.page},function(result){
                console.log(result)
                vm.data = result
                for(var i=0; i<vm.data.length; i++){
                    getTrend(vm.data[i])
                    getFollow(vm.data[i])
                }
            }, function(e){
                console.log(e)
            })

        }

        function getFollow(d){
            httpService.followFindByArticleId({articleId: d.articleId}, function(r){
                if(r.result == true){
                    d.followed = true
                }else{
                    d.followed = false
                }
            }, function(err){
                console.log(err)
            })
        }

        function getTrend(d){
            httpService.trend({articleId: d.articleId}, function(r){
                console.log(r)
                if(!r || r.length == 0){
                    d.showTrend = false
                }else{
                    d.showTrend = true
                }
                if(r.length == 1){
                    d.readTrend = '升'
                    d.shareTrend = '升'
                    d.supportTrend = '升'
                }
                if(r.length == 2){
                    if(r[r.length-1].contentnum - r[r.length-2].contentnum - r[r.length-2].contentnum > 0){
                        d.readTrend = '升'
                    }else{
                        d.readTrend = '降'
                    }
                    if(r[r.length-1].speadnum - r[r.length-2].speadnum - r[r.length-2].speadnum > 0){
                        d.shareTrend = '升'
                    }else{
                        d.shareTrend = '降'
                    }
                    if(r[r.length-1].supportnum - r[r.length-2].supportnum - r[r.length-2].supportnum > 0){
                        d.supportTrend = '升'
                    }else{
                        d.supportTrend = '降'
                    }
                }
                if(r.length > 2){
                    if(r[r.length-1].contentnum - r[r.length-2].contentnum - r[r.length-2].contentnum +r[r.length-3].contentnum >0){
                        d.readTrend = '升'
                    }else{
                        d.readTrend = '降'
                    }
                    if(r[r.length-1].speadnum - r[r.length-2].speadnum - r[r.length-2].speadnum + r[r.length-3].speadnum> 0){
                        d.shareTrend = '升'
                    }else{
                        d.shareTrend = '降'
                    }
                    if(r[r.length-1].supportnum - r[r.length-2].supportnum - r[r.length-2].supportnum + r[r.length-3].supportnum> 0){
                        d.supportTrend = '升'
                    }else{
                        d.supportTrend = '降'
                    }
                }
            }, function(err){
                console.log(err)
            })
        }

        vm.deleteFollow = function(item){
            httpService.deleteFollowById({articleId: item.articleId}, function(r){
                toastr.success('取消成功')
                fetchData()
            }, function(e){
                toastr.error('取消失败，请稍后再试')
            })

        }
        vm.pageChanged = function(){
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.follow_list', {page: vm.bigCurrentPage})
        }

        vm.app.ready(function(){
            fetchData()
        })

    }

})();