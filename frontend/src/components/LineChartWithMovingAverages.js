import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChartWithMovingAverages = ({ stockData, movingAveragesData }) => {
  // Format data for the chart
  
  const filteredStockData = stockData.filter((stock) => stock.Close !== null && !isNaN(parseFloat(stock.Close)));
  const chartData = {
    options: {
      title: {
        text: 'Stock Value',
        align: 'left'
      },
      xaxis: {
        categories: stockData.map((stock) => stock.Date),
      },
      stroke: {
        width: 2, // Set the stroke width to 2 for somewhat clear graphs
      },
      seriesNames: ['Stock Price', 'SMA', 'EMA'],
    },
    series: [
      {
        name: 'Stock Price',
        data: filteredStockData.map((stock) => ({
          x: new Date(stock.Date).getTime(),
          y: parseFloat(stock.Close), // Convert stock.Close to a number
        })),
      },
      {
        name: 'SMA',
        data: stockData.map((stock, index) => ({
          x: new Date(stock.Date).getTime(),
          y: movingAveragesData.SMA[index] || null,
        })),
      },
      {
        name: 'EMA',
        data: stockData.map((stock, index) => ({
          x: new Date(stock.Date).getTime(),
          y: movingAveragesData.EMA[index] || null,
        })),
      },
    ],
  };

  // Log the stockData and chartData for debugging

  return (
    <div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
    </div>
  );
};

export default LineChartWithMovingAverages;
