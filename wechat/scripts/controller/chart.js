(function() {
    angular
        .module('app')
        .controller('ChartCtrl', ChartCtrl);

    ChartCtrl.$inject = ['$scope', 'httpService'];

    function ChartCtrl ($scope, httpService) {

        var vm = $scope

        console.log($(document).height())
        console.log($(window).height())
        var css = {height: $(window).height()*0.8 +'px'}
        $('#emotion').css(css)

        vm.app.ready(function(){
            $('#loadingToast').fadeIn(100)
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
            var end = moment(now).subtract(12, 'hours').startOf('hour').format('YYYY-MM-DD HH:mm:ss')
            var start = moment(now).subtract(12, 'hours').startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
            httpService.emotion_date({start: start, end: end}, function(result){
                console.log(result)
                $('#loadingToast').fadeOut(100)
                var d = result.data
                var ticket = []
                var positive = []
                var middle = []
                var negative = []
                var line = []
                var line1 = []
                var line2 = []
                var maxP = 0
                var maxN = 0
                for(var i=0; i<d.length; i++){
                    ticket.push([i+1, moment(d[i].result.endtime).format('HH')])
                    if(d[i].result.positive_num + d[i].result.negative_num + d[i].result.middle_num > 100){
                        var total = d[i].result.positive_num + d[i].result.negative_num + d[i].result.middle_num
                        d[i].result.positive_num = Math.round(d[i].result.positive_num*100/total)
                        d[i].result.sensitive_num = Math.round(d[i].result.sensitive_num*100/total)
                    }
                    positive.push([i+1, d[i].result.positive_num > 99 ? -99 : 0-d[i].result.positive_num])
                    negative.push([i+1, d[i].result.sensitive_num > 99 ? 99 : d[i].result.sensitive_num])
                    line.push([i+1, 50])
                    line1.push([i+1, 90])
                    line2.push([i+1, -90])
                    if(maxP < d[i].result.positive_num){
                        maxP = d[i].result.positive_num
                    }
                    if(maxN < d[i].result.sensitive_num){
                        maxN = d[i].result.sensitive_num
                    }
                }
                if(maxP > 99){
                    maxP =99
                }
                if(maxN > 99){
                    maxN = 99
                }

                var bks = []
                var bks1 = []
                var bks2 = []
                for(var i=100; i>0; i--){
                    if(maxN < i){
                        bks.push('rgba(255,0,0,0)')
                    }else{
                        bks.push('rgba(255,0,0,'+i*0.01+')')
                    }

                    if(maxN < i){
                        bks2.push('rgba(255,0,0,'+i*0.01+')')
                    }else{
                        bks2.push('rgba(255,0,0,0)')
                    }
                }
                bks.push('rgba(255,255,255,0)')
                for(var i=1; i<=100; i++){
                    if(maxP < i){
                        bks.push('rgba(0,139,0,0)')
                    }else{
                        bks.push('rgba(0,139,0,'+i*0.01+')')
                    }

                    if(maxP < i){
                        bks1.push('rgba(0,139,0,'+i*0.01+')')
                    }else{
                        bks1.push('rgba(0,139,0,0)')
                    }

                }
                console.log(maxP)
                console.log(maxN)
                console.log(bks)
                console.log(positive)
                console.log(negative)

                function euroFormatter(v, axis) {
                    if(v >= 0){
                        return v
                    }
                    return -v
                }
                $.plot("#emotion", [
                    {
                        data: positive,
                        points: {show: false, radius: 2},
                        splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                    },
                    {
                        data: negative,
                        points: {show: false, radius: 2},
                        splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                    },
                    {
                        data: line,
                        points: {show: false, radius: 2},
                        splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                    },
                    {
                        data: line1,
                        points: {show: false, radius: 2},
                        splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                    },
                    {
                        data: line2,
                        points: {show: false, radius: 2},
                        splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                    },
                    { data: [[1,100], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0],[8,0], [9,0],[10,0],[11,0],[12,0]],
                        bars: { show: true, barWidth: 1, lineWidth: 0, fillColor: { colors: bks2 } }
                    },
                    { data: [[1,-100], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0],[8,0], [9,0],[10,0],[11,0],[12,0]],
                        bars: { show: true, barWidth: 1, lineWidth: 0, fillColor: { colors: bks1 }}
                    }

                ], {
                    colors: ['#1b9af9', '#d94b4b', '#d94b4b', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'],
                    series: {shadowSize: 3},
                    legend: {backgroundColor: 'transparent'},
                    xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                    yaxis: {show: true, font: {color: '#ccc'}, position: 'left', lineWidth: 1, min: -100, max: 100, tickFormatter: euroFormatter},
                    grid: {
                        aboveData:false,
                        backgroundColor: { colors: bks },
                        hoverable: true,
                        clickable: true,
                        borderWidth: {top: 0, bottom: 1, left: 1, right: 0},
                        borderColor: 'rgba(0,0,0,0.5)',
                        color: 'rgba(120,120,120,0.5)'
                    },
                    tooltip: true,
                    tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
                }).draw();
            }, function(err){
                console.log(err)
                $('#loadingToast').fadeOut(100)
            })
        })


    }
})();
