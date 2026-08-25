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

  // Chart 1: NVIDIA GPU TDP Evolution
  var chart1 = echarts.init(document.getElementById('chart-tdp-evolution'), null, { renderer: 'svg' });
  chart1.setOption({
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
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // Chart 2: Rack Power Density Evolution
  var chart2 = echarts.init(document.getElementById('chart-rack-density'), null, { renderer: 'svg' });
  chart2.setOption({
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
  });
  window.addEventListener('resize', function() { chart2.resize(); });

  // Chart 3: Four Cooling Technology Radar
  var chart3 = echarts.init(document.getElementById('chart-cooling-radar'), null, { renderer: 'svg' });
  chart3.setOption({
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
  });
  window.addEventListener('resize', function() { chart3.resize(); });

  // Chart 4: Global Liquid Cooling Market Size
  var chart4 = echarts.init(document.getElementById('chart-market-size'), null, { renderer: 'svg' });
  chart4.setOption({
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
  });
  window.addEventListener('resize', function() { chart4.resize(); });

  // Chart 5: AI Chip Liquid Cooling Penetration
  var chart5 = echarts.init(document.getElementById('chart-penetration'), null, { renderer: 'svg' });
  chart5.setOption({
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
  });
  window.addEventListener('resize', function() { chart5.resize(); });

  // Chart 6: TIM Thermal Resistance Comparison
  var chart6 = echarts.init(document.getElementById('chart-tim-resistance'), null, { renderer: 'svg' });
  chart6.setOption({
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
  });
  window.addEventListener('resize', function() { chart6.resize(); });

  // Chart 7: Max Heat Flux by Cooling Method
  var chart7 = echarts.init(document.getElementById('chart-heat-flux'), null, { renderer: 'svg' });
  chart7.setOption({
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
  });
  window.addEventListener('resize', function() { chart7.resize(); });

})();
