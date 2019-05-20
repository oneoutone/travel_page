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
        .controller('DataSourceCtrl', DataSourceCtrl);
    DataSourceCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

    function DataSourceCtrl($scope, httpService, toastr, $stateParams, $state) {
        var vm = $scope;

        if($stateParams.page){
            vm.page = $stateParams.page
        }else{
            vm.page = 1
        }

        vm.fetchSource = function(){
            httpService.sources({website_url: vm.filter2, website_name: vm.filter3,  pagenum: vm.page, type: "all", channel:"all"}, function(r){
                vm.urls = r.data
                vm.sources = vm.data.urls ? vm.data.urls.split(',') : []
                vm.urls.forEach(function(t){
                    var e = vm.sources.filter(function(v){
                        return v == t.result.website
                    })
                    if(e && e.length > 0){
                        t.result.checked = true
                        t.result.sourceId = e[0].id
                    }
                })
                vm.bigTotalItems = r.size
                vm.bigCurrentPage = vm.page
            }, function(e){
                console.log(e)
            })
        }



        function fetchData(){
            httpService.getRequestById({id: $stateParams.id},function(result){
                console.log(result)
                vm.data = result;
                vm.fetchSource()
            }, function(e){
                console.log(e)
            })

        }

        vm.dateSourceClicked = function(item){
            if(!item.checked){
                vm.sources.splice(vm.sources.indexOf(item.website), 1)
            }else{
                vm.sources.push(item.website)
            }
            httpService.dataSourceUpdate({id: vm.data.id, urls: vm.sources.join(',')}, function(){
                toastr.success('更新数据源成功')
            }, function (err){
                toastr.error('更新数据源失败')
            })
        }

        vm.addSourceRequest = function(item){
            if(!vm.request.sourceName){
                toastr.error('请输入数据源名称')
                return
            }
            if(!vm.request.sourceUrl){
                toastr.error('请输入数据源地址')
                return
            }
            httpService.addDataSourceRequest({
                type: vm.request.type,
                channel: vm.request.channel,
                sourceName: vm.request.sourceName,
                sourceUrl: vm.request.sourceUrl
            }, function(r){
                toastr.success('添加数据源请求成功')
                $('#myModal').modal('hide')
                fetchData1()
            }, function(e){
                toastr.error(e.message)
                console.log(e)
            })
        }

        vm.showMyModel = function(){
            vm.request = {type: '1', channel: '1'}
            $('#myModal').modal('show')
        }

        vm.addSource = function(item){
            httpService.addDataSource({sourceId: item.result.websiteId, sourceName: item.result.website, sourceUrl: item.result.website_url}, function(r){
                toastr.success('添加数据源成功')
                fetchData()
            }, function(e){
                toastr.error(e.message)
                console.log(e)
            })
        }

        vm.showDeleteModal = function(item){
            vm.deleteItem = item
            $('#delete').modal('show')
        }

        vm.deleteDataSource = function(){
            httpService.deleteDataSourceSet({id: vm.deleteItem.id}, function(r){
                toastr.success('删除数据源成功')
                $('#delete').modal('hide')
                fetchData()
            }, function(e){
                toastr.error('删除数据源失败')
            })
        }

        vm.pageChanged = function(){
            vm.page = vm.bigCurrentPage
            fetchData()
        }

        vm.app.ready(function(){
            fetchData()
        })
    }

})();