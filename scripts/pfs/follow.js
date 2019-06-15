(function() {
    'use strict';
    angular
        .module('app')
        .controller('FollowCtrl', FollowCtrl);
    FollowCtrl.$inject = ['$scope', 'httpService', '$stateParams'];

    function FollowCtrl($scope, httpService, $stateParams) {

        var vm = $scope

        function init(data){
            var ticket = []
            var t1 = []
            var t2 = []
            var t3 = []
            var t4 = []
            for(var i=0;i<data.length; i++){
                ticket.push([i+1, data[i].d])
                t1.push([i+1, data[i].readnum])
                t2.push([i+1, data[i].contentnum])
                t3.push([i+1, data[i].speadnum])
                t4.push([i+1, data[i].supportnum])
            }
            // var ticket = [[1, "2019-05-01"], [2, "2019-05-02"],[3, "2019-05-03"],[4, "2019-05-04"],[5, "2019-05-05"],[6, "2019-05-06"],[7, "2019-05-07"],[8, "2019-05-08"],[9, "2019-05-09"],[10, "2019-05-10"],[11, "2019-05-11"],[12, "2019-05-12"]]
            // var t1 = [[1, 138], [2, 215],[3, 221],[4, 190],[5, 130],[6, 121],[7, 97],[8, 71],[9, 50],[10, 35],[11, 24],[12, 22]]
            // var t2 = [[1, 135], [2, 164],[3, 144],[4, 120],[5, 110],[6, 108],[7, 99],[8, 31],[9, 22],[10, 18],[11, 16],[12, 8]]
            // var t3 = [[1, 45], [2, 53],[3, 88],[4, 76],[5, 42],[6, 32],[7, 21],[8, 20],[9, 11],[10, 3],[11, 0],[12, 0]]

            if(data[0].readnum != null){
                $.plot("#emotion1", [
                    {
                        data: t1,
                        points: {show: true, radius: 2},
                        splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                    },
                ], {
                    colors: ['#d94b4b'],
                    series: {shadowSize: 3},
                    legend: {backgroundColor: 'transparent'},
                    xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                    yaxis: {show: true, font: {color: '#ccc'}},
                    grid: {
                        hoverable: true,
                        clickable: true,
                        borderWidth: 40,
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'rgba(120,120,120,0.5)'
                    },
                    tooltip: true,
                    tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
                }).draw();
            }


            $.plot("#emotion2", [
                {
                    data: t2,
                    points: {show: true, radius: 2},
                    splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                },
            ], {
                colors: ['#d94b4b'],
                series: {shadowSize: 3},
                legend: {backgroundColor: 'transparent'},
                xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                yaxis: {show: true, font: {color: '#ccc'}},
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 40,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'rgba(120,120,120,0.5)'
                },
                tooltip: true,
                tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
            }).draw();

            $.plot("#emotion3", [
                {
                    data: t3,
                    points: {show: true, radius: 2},
                    splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                },
            ], {
                colors: ['#d94b4b'],
                series: {shadowSize: 3},
                legend: {backgroundColor: 'transparent'},
                xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                yaxis: {show: true, font: {color: '#ccc'}},
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 40,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'rgba(120,120,120,0.5)'
                },
                tooltip: true,
                tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
            }).draw();
            $.plot("#emotion4", [
                {
                    data: t4,
                    points: {show: true, radius: 2},
                    splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                },
            ], {
                colors: ['#d94b4b'],
                series: {shadowSize: 3},
                legend: {backgroundColor: 'transparent'},
                xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                yaxis: {show: true, font: {color: '#ccc'}},
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 40,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'rgba(120,120,120,0.5)'
                },
                tooltip: true,
                tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
            }).draw();
        }




        vm.app.ready(function(){
            if(!$stateParams.id){
                return
            }
            httpService.article({id: $stateParams.id}, function(r){
                vm.article = r
            }, function(e){
                console.log(e)
            })
            httpService.trend({articleId: $stateParams.id}, function(r){
                for(var i=0; i<r.length; i++){
                    console.log(moment(new Date(r[i].publishdate)).format('YYYY-MM-DD'))
                    r[i].d = moment(new Date(r[i].publishdate)).format('YYYY-MM-DD')
                }
                init(r)
            }, function(err){
                console.log(err)
            })
        })
    }

})();