import { Chart, LineController, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";


Chart.register(
    LineElement,
    LineController,
    CategoryScale,  // X축 스케일
    LinearScale,    // Y축 스케일
    PointElement,   // 데이터 포인트
    Tooltip,
);


export function makeChart(catName, timeKeys, quant, canvasId, currentTime) {
    const labels = timeKeys;
    const quantNames = [];
    for (const q of quant) {
        quantNames.push(q.shift(0));
    }
    console.log(quantNames);
    const datasets = quantNames.map((name, index) => ({
        label: name,
        data: quant[index],
        borderColor: `hsl(${index * 40}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 40}, 70%, 50%, 0.3)`,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0.5
    }));

    const totalDuration = 1000;
    const delayBetweenPoints = totalDuration / timeKeys.length;
    const a = (ctx) => {
        console.log("ctx", ctx);
        console.log("ctx.chart:", ctx.chart);
        console.log("ctx.datasetIndex:", ctx.datasetIndex);
    }

    const previousY1 = (ctx) => 
        ctx.index === 0 
            ? ctx.chart.scales.y.getPixelForValue(100) 
            : ctx.chart.getDatasetMeta(ctx.datasetIndex)
                .data[ctx.index - 1]
                .getProps(['y'], true).y;
                const previousY = (ctx) => {
                    console.log("ctx:", ctx);
                    console.log("ctx.index:", ctx.index);
                
                    if (!ctx.chart) {
                        console.error("ctx.chart is undefined!");
                        return 0;
                    }
                
                    console.log("ctx.chart:", ctx.chart);
                    console.log("ctx.datasetIndex:", ctx.datasetIndex);
                
                    const datasetMeta = ctx.chart.getDatasetMeta(ctx.datasetIndex);
                    console.log("datasetMeta:", datasetMeta);
                
                    if (!datasetMeta || !datasetMeta.data) {
                        console.error("datasetMeta or datasetMeta.data is undefined!");
                        return 0;
                    }
                
                    console.log("datasetMeta.data.length:", datasetMeta.data.length);
                
                    if (ctx.index - 1 < 0 || ctx.index - 1 >= datasetMeta.data.length) {
                        // console.error(`Invalid index: ctx.index=${ctx.index}, datasetMeta.data.length=${datasetMeta.data.length}`);
                        return 0;
                    }
                
                    const prevDataPoint = datasetMeta.data[ctx.index - 1];
                    console.log("prevDataPoint:", prevDataPoint);
                
                    if (!prevDataPoint || typeof prevDataPoint.getProps !== "function") {
                        // console.error("Error: prevDataPoint is undefined or getProps is not a function!");
                        return 0;
                    }
                
                    return prevDataPoint.getProps(['y'], true).y;
                };
                

    
    const animation = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    };


    let myCanvas = document.getElementById(canvasId);
    
    const chart1 = new Chart(myCanvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: false,
                },
                tooltip: {
                    enabled: true,
                    intersect: false,
                    position: 'nearest'
                    // mode: "index",
                }
            },
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'Time'
                    },
                    ticks: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false,
                        text: 'Quantity'
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            animation: animation
        }
    });
    
    return { chart1, myCanvas };
}