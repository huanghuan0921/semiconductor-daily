(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var accent3 = style.getPropertyValue('--accent3').trim();
  var accent4 = style.getPropertyValue('--accent4').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  function initChart(id, optionFn) {
    var el = document.getElementById(id);
    if (!el) return;
    var chart = echarts.init(el, null, { renderer: 'svg' });
    chart.setOption(optionFn());
    window.addEventListener('resize', function() { chart.resize(); });
  }

  // ===== 光模块报告图表 =====

  initChart('chart-gpu-ratio', function() {
    return {
      title: { text: 'GPU架构演进与光模块配比', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['光模块配比(每GPU对应光模块数)', '配比倍数'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['A100\n(200G)', 'H100\n(800G+400G)', 'H100综合\n(800G)', 'B100/B200\n(800G)', 'B300\n(1.6T)', 'GB200 NVL72\n(1.6T)', 'ASIC训练集群'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10, interval: 0 }
      },
      yAxis: [
        { type: 'value', name: '配比(个)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { type: 'value', name: '倍数', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '光模块配比(每GPU对应光模块数)',
          type: 'bar',
          data: [6, 2.5, 1.5, 3.5, 4.5, 2.25, 8],
          itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
          barWidth: '45%',
          label: { show: true, position: 'top', color: ink, fontSize: 11, fontWeight: 600 }
        },
        {
          name: '配比倍数',
          type: 'line',
          yAxisIndex: 1,
          data: [6, 2.5, 1.5, 3.5, 4.5, 2.25, 8],
          lineStyle: { color: accent2, width: 2, type: 'dashed' },
          itemStyle: { color: accent2 },
          symbol: 'circle',
          symbolSize: 8
        }
      ],
      animation: false
    };
  });

  initChart('chart-speed-evolution', function() {
    return {
      title: { text: '光模块速率演进与出货量预测（百万只）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'cross' } },
      legend: { data: ['800G出货量', '1.6T出货量', '800G市场规模(亿美元)'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '10%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['2024', '2025', '2026', '2027', '2028'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      yAxis: [
        { type: 'value', name: '出货量(百万只)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { type: 'value', name: '市场规模(亿美元)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '800G出货量',
          type: 'bar',
          data: [8, 20, 33.5, 55, 94],
          itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 10, formatter: '{c}M' }
        },
        {
          name: '1.6T出货量',
          type: 'bar',
          data: [0, 0.5, 13, 46, 80],
          itemStyle: { color: accent3, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 10, formatter: '{c}M' }
        },
        {
          name: '800G市场规模(亿美元)',
          type: 'line',
          yAxisIndex: 1,
          data: [40, 130, 200, 280, 350],
          lineStyle: { color: accent2, width: 2 },
          itemStyle: { color: accent2 },
          symbol: 'circle',
          symbolSize: 8
        }
      ],
      animation: false
    };
  });

  initChart('chart-tech-radar', function() {
    return {
      title: { text: '四大技术路线多维度对比', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'item', appendToBody: true },
      legend: { data: ['可插拔(DSP)', 'LPO', 'NPO', 'CPO'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      radar: {
        indicator: [
          { name: '成熟度', max: 10 },
          { name: '低功耗', max: 10 },
          { name: '低成本', max: 10 },
          { name: '高密度', max: 10 },
          { name: '可维护性', max: 10 },
          { name: '互操作性', max: 10 },
          { name: '长距适用', max: 10 }
        ],
        center: ['50%', '52%'],
        radius: '65%',
        axisName: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule } },
        splitArea: { areaStyle: { color: ['rgba(37,99,235,0.02)', 'rgba(37,99,235,0.04)'] } },
        axisLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'radar',
        data: [
          { value: [10, 3, 6, 4, 10, 10, 10], name: '可插拔(DSP)', lineStyle: { color: accent, width: 2 }, itemStyle: { color: accent }, areaStyle: { color: accent + '20' } },
          { value: [6, 8, 9, 4, 9, 6, 3], name: 'LPO', lineStyle: { color: accent3, width: 2 }, itemStyle: { color: accent3 }, areaStyle: { color: accent3 + '20' } },
          { value: [4, 7, 5, 7, 7, 3, 4], name: 'NPO', lineStyle: { color: accent4, width: 2 }, itemStyle: { color: accent4 }, areaStyle: { color: accent4 + '20' } },
          { value: [5, 10, 3, 10, 2, 2, 2], name: 'CPO', lineStyle: { color: accent2, width: 2 }, itemStyle: { color: accent2 }, areaStyle: { color: accent2 + '20' } }
        ]
      }],
      animation: false
    };
  });

  initChart('chart-power-evolution', function() {
    return {
      title: { text: '各速率光模块功耗对比（W）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['传统DSP可插拔', 'LPO方案', 'CPO方案'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['400G', '800G', '1.6T', '3.2T'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 12 }
      },
      yAxis: {
        type: 'value', name: '功耗(W)',
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '传统DSP可插拔',
          type: 'bar',
          data: [10, 17, 21, 50],
          itemStyle: { color: accent2, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 11, formatter: '{c}W' }
        },
        {
          name: 'LPO方案',
          type: 'bar',
          data: [5, 7, 12, null],
          itemStyle: { color: accent3, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 11, formatter: '{c}W' }
        },
        {
          name: 'CPO方案',
          type: 'bar',
          data: [null, null, null, 18],
          itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 11, formatter: '{c}W' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-liquid-cooling', function() {
    return {
      title: { text: '液冷渗透率演进趋势（%）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: { data: ['AI芯片液冷渗透率', '企业DC液冷采用率'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '10%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['2024', '2025', '2026', '2027(预期)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      yAxis: {
        type: 'value', name: '渗透率(%)', max: 70,
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, formatter: '{value}%' },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: 'AI芯片液冷渗透率',
          type: 'line',
          data: [30, 40, 53, 60],
          lineStyle: { color: accent, width: 3 },
          itemStyle: { color: accent },
          symbol: 'circle',
          symbolSize: 10,
          areaStyle: { color: accent + '20' },
          label: { show: true, position: 'top', color: ink, fontSize: 11, formatter: '{c}%' }
        },
        {
          name: '企业DC液冷采用率',
          type: 'line',
          data: [20.1, 28, 38.3, 48],
          lineStyle: { color: accent4, width: 3 },
          itemStyle: { color: accent4 },
          symbol: 'circle',
          symbolSize: 10,
          label: { show: true, position: 'bottom', color: ink, fontSize: 11, formatter: '{c}%' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-market-size', function() {
    return {
      title: { text: '全球光模块市场规模演进（亿美元）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['市场规模(亿美元)', '同比增长率(%)'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '10%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['2024', '2025', '2026', '2027(预测)', '2029(预测)', '2031(预测)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      yAxis: [
        { type: 'value', name: '亿美元', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { type: 'value', name: '增长率(%)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, formatter: '{value}%' }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '市场规模(亿美元)',
          type: 'bar',
          data: [178, 235, 285, 350, 450, 600],
          itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 10, formatter: '{c}' }
        },
        {
          name: '同比增长率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: [null, 32, 60, 23, 14, 15],
          lineStyle: { color: accent2, width: 2 },
          itemStyle: { color: accent2 },
          symbol: 'circle',
          symbolSize: 8,
          label: { show: true, position: 'top', color: accent2, fontSize: 10, formatter: '{c}%' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-market-share', function() {
    return {
      title: { text: '2025年全球光模块厂商市场份额', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'item', appendToBody: true, formatter: '{b}: {d}%' },
      legend: { type: 'scroll', orient: 'vertical', right: '5%', top: 'middle', textStyle: { color: muted, fontSize: 11 } },
      series: [{
        type: 'pie',
        center: ['40%', '52%'],
        radius: ['35%', '65%'],
        label: { color: ink, fontSize: 11, formatter: '{b}\n{d}%' },
        labelLine: { lineStyle: { color: rule } },
        data: [
          { value: 23, name: '中际旭创(中国)', itemStyle: { color: accent } },
          { value: 15, name: '新易盛(中国)', itemStyle: { color: accent3 } },
          { value: 16, name: 'Coherent(美国)', itemStyle: { color: accent2 } },
          { value: 12, name: 'Lumentum(美国)', itemStyle: { color: accent4 } },
          { value: 24, name: '中国其他厂商', itemStyle: { color: accent + '80' } },
          { value: 10, name: '其他国际厂商', itemStyle: { color: muted } }
        ]
      }],
      animation: false
    };
  });

  // ===== 液冷报告图表 =====

  initChart('chart-tdp-evolution', function() {
    return {
      title: { text: 'NVIDIA GPU TDP演进趋势（W）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['单GPU TDP(W)', '代际增长率(%)'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '10%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['A100\n(2020)', 'H100 SXM\n(2022)', 'H200\n(2023)', 'B200\n(2024)', 'B300\n(2025)', 'Rubin\n(2026-27)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10, interval: 0 }
      },
      yAxis: [
        { type: 'value', name: 'TDP(W)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { type: 'value', name: '增长率(%)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, formatter: '{value}%' }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '单GPU TDP(W)',
          type: 'bar',
          data: [400, 700, 700, 1000, 1400, 1800],
          itemStyle: {
            color: function(params) {
              var colors = [accent, accent, accent, accent4, accent2, accent2];
              return colors[params.dataIndex];
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '50%',
          label: { show: true, position: 'top', color: ink, fontSize: 11, fontWeight: 600, formatter: '{c}W' }
        },
        {
          name: '代际增长率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: [null, 75, 0, 43, 40, 29],
          lineStyle: { color: accent4, width: 2, type: 'dashed' },
          itemStyle: { color: accent4 },
          symbol: 'circle',
          symbolSize: 8,
          label: { show: true, position: 'top', color: accent4, fontSize: 10, formatter: '{c}%' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-rack-density', function() {
    return {
      title: { text: '数据中心机柜功率密度演进（kW/rack）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'cross' } },
      legend: { data: ['典型机柜功率密度', '风冷极限', '液冷AI机柜'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['2020', '2021', '2022', '2023', '2024', '2025', '2026(预期)', '2027(预期)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      yAxis: {
        type: 'value', name: 'kW/rack', max: 280,
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '典型机柜功率密度',
          type: 'line',
          data: [8, 10, 15, 20, 30, 50, 80, 120],
          lineStyle: { color: accent, width: 3 },
          itemStyle: { color: accent },
          symbol: 'circle',
          symbolSize: 8,
          areaStyle: { color: accent + '15' }
        },
        {
          name: '风冷极限',
          type: 'line',
          data: [15, 15, 15, 15, 15, 15, 15, 15],
          lineStyle: { color: accent2, width: 2, type: 'dashed' },
          itemStyle: { color: accent2 },
          symbol: 'none'
        },
        {
          name: '液冷AI机柜',
          type: 'line',
          data: [null, null, null, null, 72, 120, 132, 240],
          lineStyle: { color: accent4, width: 3 },
          itemStyle: { color: accent4 },
          symbol: 'circle',
          symbolSize: 10,
          label: { show: true, position: 'top', color: accent4, fontSize: 10, formatter: '{c}kW' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-cooling-radar', function() {
    return {
      title: { text: '四种液冷技术多维度对比', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'item', appendToBody: true },
      legend: { data: ['冷板式', '单相浸没', '两相浸没', '背门散热'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      radar: {
        indicator: [
          { name: '散热效率', max: 10 },
          { name: '成本优势', max: 10 },
          { name: '部署灵活性', max: 10 },
          { name: '维护便利性', max: 10 },
          { name: 'PUE优化', max: 10 },
          { name: '密度适用性', max: 10 },
          { name: '成熟度', max: 10 }
        ],
        center: ['50%', '52%'],
        radius: '65%',
        axisName: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule } },
        splitArea: { areaStyle: { color: ['rgba(8,145,178,0.02)', 'rgba(8,145,178,0.04)'] } },
        axisLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'radar',
        data: [
          { value: [8, 7, 9, 9, 7, 8, 10], name: '冷板式', lineStyle: { color: accent, width: 2 }, itemStyle: { color: accent }, areaStyle: { color: accent + '20' } },
          { value: [7, 6, 4, 4, 8, 8, 6], name: '单相浸没', lineStyle: { color: accent3, width: 2 }, itemStyle: { color: accent3 }, areaStyle: { color: accent3 + '20' } },
          { value: [10, 4, 3, 3, 10, 10, 4], name: '两相浸没', lineStyle: { color: accent2, width: 2 }, itemStyle: { color: accent2 }, areaStyle: { color: accent2 + '20' } },
          { value: [4, 9, 10, 10, 4, 3, 8], name: '背门散热', lineStyle: { color: accent4, width: 2 }, itemStyle: { color: accent4 }, areaStyle: { color: accent4 + '20' } }
        ]
      }],
      animation: false
    };
  });

  initChart('chart-liquid-market-size', function() {
    return {
      title: { text: '全球数据中心液冷市场规模预测（亿美元）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['市场规模(亿美元)', '同比增长率(%)'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '10%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['2025', '2026', '2027', '2028', '2029', '2030', '2031'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      yAxis: [
        { type: 'value', name: '亿美元', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, splitLine: { lineStyle: { color: rule, type: 'dashed' } } },
        { type: 'value', name: '增长率(%)', axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, formatter: '{value}%' }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '市场规模(亿美元)',
          type: 'bar',
          data: [44.4, 62, 85, 110, 135, 160, 187.9],
          itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', color: ink, fontSize: 10, formatter: '{c}' }
        },
        {
          name: '同比增长率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: [null, 40, 37, 29, 23, 19, 17],
          lineStyle: { color: accent2, width: 2 },
          itemStyle: { color: accent2 },
          symbol: 'circle',
          symbolSize: 8,
          label: { show: true, position: 'top', color: accent2, fontSize: 10, formatter: '{c}%' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-penetration', function() {
    return {
      title: { text: 'AI芯片液冷渗透率演进（%）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: { data: ['AI芯片液冷渗透率', '中国液冷服务器渗透率', 'Google液冷采用率'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '10%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['2024', '2025', '2026', '2027(预期)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted }
      },
      yAxis: {
        type: 'value', name: '渗透率(%)', max: 90,
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, formatter: '{value}%' },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: 'AI芯片液冷渗透率',
          type: 'line',
          data: [25, 33, 53, 60],
          lineStyle: { color: accent, width: 3 },
          itemStyle: { color: accent },
          symbol: 'circle',
          symbolSize: 10,
          areaStyle: { color: accent + '20' },
          label: { show: true, position: 'top', color: ink, fontSize: 11, formatter: '{c}%' }
        },
        {
          name: '中国液冷服务器渗透率',
          type: 'line',
          data: [12, 20, 37, 50],
          lineStyle: { color: accent4, width: 3 },
          itemStyle: { color: accent4 },
          symbol: 'circle',
          symbolSize: 10,
          label: { show: true, position: 'bottom', color: accent4, fontSize: 10, formatter: '{c}%' }
        },
        {
          name: 'Google液冷采用率',
          type: 'line',
          data: [50, 65, 80, 90],
          lineStyle: { color: accent3, width: 2, type: 'dashed' },
          itemStyle: { color: accent3 },
          symbol: 'diamond',
          symbolSize: 8,
          label: { show: true, position: 'top', color: accent3, fontSize: 10, formatter: '{c}%' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-tim-resistance', function() {
    return {
      title: { text: 'TIM类型热阻对比（mm²·K/W）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['热阻(mm²·K/W)'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['聚合物TIM', 'InSn焊接TIM', '梯度液态金属\n-陶瓷', '液态金属TIM', '碳纳米管/\n石墨烯'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10, interval: 0 }
      },
      yAxis: {
        type: 'value', name: '热阻(mm²·K/W)',
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '热阻(mm²·K/W)',
          type: 'bar',
          data: [
            { value: 3, itemStyle: { color: accent2 } },
            { value: 0.5, itemStyle: { color: accent4 } },
            { value: 0.4, itemStyle: { color: accent3 } },
            { value: 0.018, itemStyle: { color: accent } },
            { value: 0.3, itemStyle: { color: accent + '80' } }
          ],
          barWidth: '45%',
          label: { show: true, position: 'top', color: ink, fontSize: 11, fontWeight: 600, formatter: '{c}' }
        }
      ],
      animation: false
    };
  });

  initChart('chart-heat-flux', function() {
    return {
      title: { text: '不同冷却方式最大热流密度对比（W/cm²）', left: 'center', textStyle: { fontSize: 14, color: ink, fontWeight: 600 } },
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { data: ['最大热流密度(W/cm²)', '当前AI芯片热点'], bottom: 0, textStyle: { color: muted, fontSize: 11 } },
      grid: { left: '8%', right: '8%', bottom: '15%', top: '15%' },
      xAxis: {
        type: 'category',
        data: ['传统风冷', '单相液冷', '相变冷板', '两相冷板', '微通道蒸发\n(前沿)'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 10, interval: 0 }
      },
      yAxis: {
        type: 'value', name: 'W/cm²',
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '最大热流密度(W/cm²)',
          type: 'bar',
          data: [
            { value: 0.1, itemStyle: { color: muted } },
            { value: 100, itemStyle: { color: accent } },
            { value: 400, itemStyle: { color: accent3 } },
            { value: 500, itemStyle: { color: accent4 } },
            { value: 1200, itemStyle: { color: accent2 } }
          ],
          barWidth: '45%',
          label: { show: true, position: 'top', color: ink, fontSize: 11, fontWeight: 600, formatter: '{c}' }
        },
        {
          name: '当前AI芯片热点',
          type: 'line',
          data: [600, 600, 600, 600, 600],
          lineStyle: { color: accent2, width: 2, type: 'dashed' },
          itemStyle: { color: accent2 },
          symbol: 'none',
          markLine: {
            symbol: 'none',
            lineStyle: { color: accent2, type: 'dashed', width: 1 },
            label: { formatter: 'AI芯片热点极限600W/cm²', color: accent2, fontSize: 10 },
            data: [{ yAxis: 600 }]
          }
        }
      ],
      animation: false
    };
  });

})();
