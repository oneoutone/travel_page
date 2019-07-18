(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsStatisticsCtrl', pfsStatisticsCtrl);
	pfsStatisticsCtrl.$inject = ['$scope'];

	function pfsStatisticsCtrl($scope) {
		var vm = $scope

		var color1 = "#fbcf03";
		var color2 = "#ff00ff";
		var color3 = "#1886ff";
		var xyc = "rgba(255,255,255,0.4)";
		var legend = {
			noColumns: 0,
			backgroundColor: "#fff",
			labelBoxBorderColor: "#fff",
			backgroundOpacity: 0,
			position: "ne"
		};
		//静态统计图1
		var vData = [
			[0, 0.25],
			[0.2, 0.50],
			[0.4, 0.35],
			[0.6, 0.4],
			[0.8, 0.65],
			[1, 0.18]
		];
		$.plot($("#chart"), [{
			color: color1,
			data: vData
		}], {
			series: {
				lines: {
					show: true
				}
			},
			xaxis: {
				color: xyc,
				tickColor: "#fff",
				ticks: 4,
				min: 0,
				max: 1
			},
			yaxis: {
				color: xyc,
				tickColor: "#fff",
				ticks: 5,
				min: 0,
				max: 1
			},
			grid: {
				color: "#fff"
			}
		});

		//静态统计图2

		var line1 = [];
		var line2 = [];
		var line3 = [];

		for(var i = 0; i <= 1; i += 0.1) {
			line2.push([i, i * Math.sin(i)]);
			line3.push([i, i * Math.cos(i)]);
			line1.push([i, i * (Math.sin(i) + Math.cos(i))]);
		}
		$.plot($("#chart2"), [{
				color: color1,
				data: line1,
				label: "全部",
				lines: {
					show: true,
					lineWidth: 2
				}
			}, {
				color: color2,
				data: line2,
				label: "敏感",
				lines: {
					show: true,
					lineWidth: 2
				}
			},
			{
				color: color3,
				data: line3,
				label: "非敏感",
				lines: {
					show: true
				}
			}
		], {
			series: {
				points: {
					show: true
				}
			},
			grid: {
				color: "#fff",
				hoverable: true,
				clickable: true
			},
			xaxis: {
				color: xyc,
				min: 0,
				max: 1.0
			},
			yaxis: {
				color: xyc,
				min: 0,
				max: 1.0
			},
			legend: legend,
		});
		//静态统计图3
		var data1 = [
			[0, 26],
			[4, 49],
			[8, 31],
			[12, 28],
			[16, 26],
			[20, 49],
			[24, 31],
			[28, 28]
		];
		var data2 = [
			[1, 11],
			[5, 25],
			[9, 13],
			[13, 14],
			[17, 11],
			[21, 25],
			[25, 13],
			[29, 14]
		];
		var data3 = [
			[2, 15],
			[6, 24],
			[10, 18],
			[14, 14],
			[18, 15],
			[22, 24],
			[26, 18],
			[30, 14]
		];

		var dataset = [{
				label: "全部",
				data: data1,
				color: color1
			}, {
				label: "敏感",
				data: data2,
				color: color2
			},
			{
				label: "非敏感",
				data: data3,
				color: color3
			}
		];

		var options = {
			series: {
				bars: {
					show: true
				}
			},
			bars: {
				align: "left",
				barWidth: 1
			},
			xaxis: {
				color: xyc,
				axisLabel: "",
				axisLabelUseCanvas: true,
				axisLabelFontSizePixels: 12,
				axisLabelFontFamily: 'Verdana, Arial',
				axisLabelPadding: 10,
				ticks: 30

			},
			yaxis: {
				color: xyc,
				axisLabel: "支付金额",
				axisLabelUseCanvas: true,
				axisLabelFontSizePixels: 12,
				axisLabelFontFamily: 'Verdana, Arial',
				axisLabelPadding: 3
			},
			legend: legend,
			grid: {
				hoverable: true,
				color: "#fff"
			}
		};
		$.plot($("#chart3"), dataset, options);
	}

})();