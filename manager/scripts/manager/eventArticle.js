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
        .controller('EventBindCtrl', EventBindCtrl);

    EventBindCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function EventBindCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        vm.page1 = 1
        vm.page2 = 1

        vm.fetchEvents = function(){
            httpService.eventList({size: 100, page: 1}, function(data){
                vm.events = data
            }, function(err){
                console.log(err)
            })
        }

        vm.eventSelected = function(){
            console.log('eventSelected')
            console.log(vm.selectEvent)
            vm.eventId = vm.selectEvent
            vm.page2 = 1
            vm.fetchArticle()
        }

        vm.pageChanged1 = function(){
            vm.page1 = vm.bigCurrentPage1
            vm.fetchData()
        }

        vm.pageChanged2 = function(){
            vm.page2 = vm.bigCurrentPage2
            vm.fetchArticle()
        }

        vm.add = function(item){
            if(!vm.eventId){
                toastr.error('请选择相关事件')
                return
            }
            httpService.upsertEventArticle({
                articleId: item.result.article_id,
                title: item.result.title,
                content: item.result.content,
                source_name: item.result.source_name,
                publish_time: item.result.publish_time,
                eventId: vm.eventId,
                postive:item.result.postive
            }, function(r){
                vm.fetchArticle()
                toastr.success('添加新闻成功')
            }, function(err){
                toastr.error('添加新闻失败，请稍后再试')
            })
        }

        vm.delete = function(item){
            httpService.deleteEventArticleById({id: item.id}, function(r){
                vm.fetchArticle()
                toastr.success('删除新闻成功')
            }, function(e){
                vm.fetchArticle()
                toastr.error('删除新闻失败，请稍后再试')
            })
        }

        vm.fetchArticle = function() {
            var data = {eventId: vm.eventId, page: vm.page2, size: 5}
            httpService.eventArticleCount(data, function (result) {
                console.log(result)
                vm.bigTotalItems2 = result.count
                vm.bigCurrentPage2 = vm.page2
            }, function (e) {
                console.log(e)
            })

            httpService.eventArticleList(data, function (result) {
                console.log(result)
                vm.data2 = result
            }, function (e) {
                console.log(e)
            })
        }

        vm.fetchData = function(){
            var data = {page: vm.page1, size: 5}
            data.article_type = 4
            data.sentiment = 4
            httpService.data_count(data,function(result){
                console.log(result)
                vm.bigTotalItems1 = result.size
                vm.bigCurrentPage1 = vm.page1
            }, function(e){
                console.log(e)
            })

            httpService.data(data,function(result){
                console.log(result)
                vm.data1 = result.data
                for(var i=0; i<vm.data1.length; i++){
                    if(vm.data1[i].result.content.length > 100){
                        vm.data1[i].result.desc = vm.data1[i].result.content.substr(0, 100)+'...'
                    }
                    if(!vm.data1[i].result.content && vm.data1[i].result.title){
                        vm.data1[i].result.desc = vm.data1[i].result.title
                    }
                    if(!vm.data1[i].result.title || vm.data1[i].result.title == ''){
                        vm.data1[i].result.title = vm.data1[i].result.content
                    }
                }
            }, function(e){
                console.log(e)
            })

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
            vm.fetchEvents()
            vm.fetchData()
        })
    }
})();
