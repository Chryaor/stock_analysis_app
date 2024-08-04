import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Accordion, Form, Button, Table, Row, Col, Tabs, Tab } from 'react-bootstrap';
import './styles/MainPage.css';
import 'chartjs-adapter-date-fns';
import LineChartWithMovingAverages from './LineChartWithMovingAverages';
//import { Line } from 'react-chartjs-2';
//import ReactApexChart from 'react-apexcharts';

//WCIG of 4.5(if you do not have 4.5, not enough to calculate)
const MainPage = () => {
  const [stockData, setStockData] = useState([]);
  const [smaPeriod, setSmaPeriod] = useState(20);
  const [emaPeriod, setEmaPeriod] = useState(20);
  const [movingAveragesData, setMovingAveragesData] = useState(null);


  // Function to fetch stock data from the Flask API
  const fetchStockData = useCallback(() => {
    axios
      .get('http://localhost:5000/api/stock_data')
      .then((response) => {
        // Convert the 'Close' values to numbers
        const stockDataWithNumericClose = response.data.data.map((stock) => ({
          ...stock,
          Close: parseFloat(stock['4. close']),
        }));

        // Set the fetched stock data to the state
        setStockData(stockDataWithNumericClose);
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });
  }, []);
  // Include any dependencies if needed, but here it's an empty array []
  // Function to fetch moving averages data from the Flask API
  const fetchMovingAveragesData = useCallback(() => {
    axios
      .get(`http://localhost:5000/api/analysis/moving_averages?sma_period=${smaPeriod}&ema_period=${emaPeriod}`)
      .then((response) => {
        // Ensuring that SMA and EMA arrays have the same length, this had an error so correcting this
        const minDataLength = Math.min(response.data.SMA.length, response.data.EMA.length);

        // Create an array of dates for the valid data points
        const filteredDates = response.data.Date.slice(0, minDataLength);

        // Create a new object with the filtered data
        const filteredData = {
          Date: filteredDates,
          SMA: response.data.SMA.slice(0, minDataLength),
          EMA: response.data.EMA.slice(0, minDataLength),
        };

        setMovingAveragesData(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching moving averages data:', error);
      });
  }, [smaPeriod, emaPeriod]);


  // Fetch stock data and moving averages data when the component mounts
  useEffect(() => {
    fetchStockData();
    fetchMovingAveragesData();

  }, [fetchStockData, fetchMovingAveragesData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Fetch data with updated SMA and EMA periods
    fetchMovingAveragesData();
  };



  // Generate the line chart data

  return (
    <div>
      <Tabs defaultActiveKey="stockData" id="main-tabs">
        <Tab eventKey="stockData" title="Stock Data">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((stock) => (
                <tr key={stock['Date']}>
                  <td>{stock['Date']}</td>
                  <td>{stock['1. open']}</td>
                  <td>{stock['2. high']}</td>
                  <td>{stock['3. low']}</td>
                  <td>{stock['4. close']}</td>
                  <td>{stock['5. volume']}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="analysis" title="Analysis">
          <div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Moving Averages</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row className="align-items-center">
                      <Col xs="auto" className="my-1">
                        <Form.Label className="me-sm-2">SMA Period:</Form.Label>
                        <Form.Control
                          type="number"
                          value={smaPeriod}
                          onChange={(e) => setSmaPeriod(parseInt(e.target.value, 10))}
                          className="me-sm-2"
                          style={{ width: '200px' }}
                        />
                      </Col>
                      <Col xs="auto" className="my-1">
                        <Form.Label className="me-sm-2">EMA Period:</Form.Label>
                        <Form.Control
                          type="number"
                          value={emaPeriod}
                          onChange={(e) => setEmaPeriod(parseInt(e.target.value, 10))}
                          className="me-sm-2"
                          style={{ width: '200px' }}
                        />
                      </Col>
                      <Col xs="auto" className="my-1" >
                        <Button className='button-bbf' type="submit" >
                          Refresh
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  {movingAveragesData ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>SMA</th>
                          <th>EMA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movingAveragesData.Date.map((date, index) => (
                          <tr key={date}>
                            <td>{date}</td>
                            <td>{movingAveragesData.SMA[index]}</td>
                            <td>{movingAveragesData.EMA[index]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div>Loading...</div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Tab>
        <Tab eventKey="results" title="Charts">
          {stockData.length > 0 && movingAveragesData ? (
            <LineChartWithMovingAverages stockData={stockData} movingAveragesData={movingAveragesData} />
          ) : (
            <div>Loading...</div>
          )}
        </Tab>

      </Tabs>
    </div>
  );
};

export default MainPage;