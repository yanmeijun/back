<template>
  <ECharts class="chart" ref="chart" :option="options" />
</template>
<script>
import pointPng from './img/line.png';
export default {
  name: 'line-chart',
  props: {
    setData: {
      type: Object,
      default: () => {
        return {
          xData: [],
          yData: []
        };
      }
    }
  },
  data() {
    return {
      options: {}
    };
  },
  watch: {
    setData() {
      this.setOptions();
    }
  },
  mounted() {
    this.setOptions();
  },
  methods: {
    setOptions() {
      let { xData = [], yData = [] } = this.setData || {};
      let max = Math.max(...yData);
      yData = yData.map(ele => {
        let obj = { value: ele };
        if (ele === max) {
          return obj;
        }
        return Object.assign({}, obj, {
          label: {
            normal: {
              show: true,
              fontSize: 12,
              color: '#fff',
              position: 'top',
              backgroundColor: {
                image: pointPng
              },
              padding: [5, 6, 8, 6]
            }
          }
        });
      });
      this.options = {
        color: ['#1890FF'],
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#ccc',
              width: 1 //这里是为了突出显示加上的
            }
          },
          axisLabel: {
            rotate: 15,
            fontSize: 10,
            interval: false
          }
        },
        tooltip: {
          trigger: 'axis',
          // showContent: false,
          // position: function(point, params, dom, rect, size) {
          //   return [-1000000, -1000000];
          // },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(145, 213, 255, 0.15)'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#D8D8D8',
              width: 1 //这里是为了突出显示加上的
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        legend: {
          left: 'center',
          textStyle: {
            color: '#999999',
            fontSize: 14
          },
          icon: 'roundRect',
          itemWidth: 47, //图例的宽度
          itemHeight: 7 //图例的高度
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '0',
          containLabel: true
        },
        series: [
          {
            name: '数量',
            data: yData,
            type: 'line',
            smooth: true, //true 为平滑曲线，false为直线
            symbol: 'circle',
            symbolSize: 8,
            hoverAnimation: true,
            showSymbol: false,
            lineStyle: {
              width: 5
            },
            itemStyle: {
              normal: {
                barBorderRadius: 0
              }
            },
            markPoint: {
              label: {
                color: '#fff'
              },
              data: [
                {
                  name: '最大值',
                  type: 'max'
                }
              ]
            },
            emphasis: {
              itemStyle: {
                color: '#1890FF', //颜色
                borderColor: '#fff', //图形的描边颜色
                borderWidth: 4, // 描边的线宽
                shadowBlur: 6, // 图形的阴影大小
                shadowColor: '#0c87fb' // 图形的阴影颜色
              }
            }
          }
        ]
      };
    }
  }
};
</script>
<style lang="scss">
.chart {
  width: 100%;
  height: 100%;
}
</style>
