(function() {
    angular
        .module('app')
        .controller('AnalysisCtrl', AnalysisCtrl);

    AnalysisCtrl.$inject = ['$scope', 'httpService'];

    function AnalysisCtrl ($scope, httpService) {

        var vm = $scope

        vm.app.ready(function(){
            console.log('syartsss')
            httpService.today_data(function(result){
                console.log(result)
                vm.today_history = [{label:'网站：'+result.website_num, data: result.website_num},{label:'微信： '+result.wechat_num, data:result.wechat_num},{label:'微博： '+result.weibo_num, data:result.weibo_num}]
                $.plot("#chart1",
                    vm.today_history,
                    {
                        series: { pie: { show: true, innerRadius: 0, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
                        legend: {backgroundColor: 'transparent'},
                        colors: [vm.app.color.primary],
                        grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#666' },
                        tooltip: true,
                        tooltipOpts: { content: '%s: %p%' }
                    }).draw();
            }, function(err){
                console.log(err)
            })

            var now = new Date();
            var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
            var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
            httpService.emotion_date({start: start, end: end}, function(result){
                console.log(result)
                var d = result.data
                var ticket = []
                var positive = []
                var middle = []
                var negative = []
                var line = []
                for(var i=0; i<d.length; i++){
                    ticket.push([i+1, moment(d[i].result.endtime).format('HH')])
                    positive.push([i+1, d[i].result.positive_num])
                    middle.push([i+1, d[i].result.middle_num])
                    negative.push([i+1, d[i].result.negative_num])
                    line.push([i+1, 10])
                    $.plot("#emotion", [
                        {
                            data: positive,
                            points: {show: false, radius: 2},
                            splines: {show: true, tension: 0.45, lineWidth: 1, fill: 0}
                        },
                        {
                            data: middle,
                            points: {show: false, radius: 2},
                            splines: {show: true, tension: 0.45, lineWidth: 1, fill: 0}
                        },
                        {
                            data: negative,
                            points: {show: false, radius: 2},
                            splines: {show: true, tension: 0.45, lineWidth: 1, fill: 0}
                        },
                        {
                            data: line,
                            points: {show: false, radius: 2},
                            splines: {show: true, tension: 0.45, lineWidth: 1, fill: 0}
                        }
                    ], {
                        colors: ['#1b9af9', '#f5bc34', '#d94b4b', '#ff0000'],
                        series: {shadowSize: 3},
                        legend: {backgroundColor: 'transparent'},
                        xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                        yaxis: {show: true, font: {color: '#ccc'}},
                        grid: {
                            hoverable: true,
                            clickable: true,
                            borderWidth: 20,
                            borderColor: 'rgba(255,255,255,0.5)',
                            color: 'rgba(120,120,120,0.5)'
                        },
                        tooltip: true,
                        tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
                    }).draw();
                }
            }, function(err){
                console.log(err)
            })
        })


    }
})();
