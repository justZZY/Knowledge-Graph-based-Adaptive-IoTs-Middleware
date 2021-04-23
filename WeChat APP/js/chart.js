export const rateOption = {
  title: {
    text: '仪表盘初始化模板',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  series: [
    {
      type: 'gauge',
      detail: {
        formatter: '{value}'
      },
      data: [
        {
          value: 0
        }
      ],
      min: 0,
      max: 40
    }
  ]
}

export const monitorOption = {
  grid: {   //图表距离四周的距离，x：左，x2：右，y：上，y2：下
    x: 50,
    x2: 50,
    y: 40,
    y2: 40
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [], // 转换为时间戳
      axisLabel: {
        show: false
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      boundaryGap: ['0', '0.3'],   //图表留白比例：下侧0%，上侧30%
      splitLine: {    //分割线
        lineStyle: {    //类型
          type: 'dashed'  //虚线
        }
      }
    }
  ],
  series: [
  ]
}

/*
 * @des 需要写入data/links/categories/三组数据
 */
export const relationOption = {
  title: {
    text: '智能水务知识图谱',
    top: 'top',
    left: 'left'
  },
  tooltip: {
    formatter: function (x) {
      return x.data.des
    }
  },
  toolbox: {
    show: true,
    feature: {
      restore: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  animationDuration: 1000,
  animationEasingUpdate: 'quinticInOut',
  series: [{
    type: 'graph',
    layout: 'force',
    force: {
      repulsion: 100,
      edgeLength: 200,
      layoutAnimation: true
    },
    // 添加标记极度影响性能,直接注释掉
    // edgeSymbol: ['none', 'arrow'],
    // edgeLabel: {
    //   normal: {
    //     show: true
    //   }
    // },
    data: [],
    links: [],
    categories: [],
    roam: true,
    focusNodeAdjacency: true,
    label: {
      position: 'right',
      formatter: '{b}'
    },
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 1,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    },
    lineStyle: {
      color: 'source',
      curveness: 0.3
    },
    emphasis: {
      lineStyle: {
        width: 10
      }
    }
  }]
}

const labelOption = {
  show: true,
  position: 'insideBottom',
  distance: 15,
  align: 'left',
  verticalAlign: 'middle',
  rotate: 90,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {
      textBorderColor: '#fff'
    }
  }
}

export const barOption = {
  color: ['#003366', '#4cabce'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['Forest', 'Steppe']
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['2016', '2017', '2018', '2019', '2020']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Forest',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      data: [320, 332, 301, 334, 390]
    },
    {
      name: 'Steppe',
      type: 'bar',
      label: labelOption,
      data: [220, 182, 191, 234, 290]
    }
  ]
}
