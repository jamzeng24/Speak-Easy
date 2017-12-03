/*
 * Before using this file, type
 * 'npm install react-chartjs-2 chart.js --save'
 *
 * Pass in various props (listed in the constructor) to the <Chart /> tag to
 * edit certain aspects of the chart.
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';

 /*
     * Function to decide color of bar based on type
     */
function backgroundColors(type) {
        if (type == 1) {
            return ['rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)'];
        } else if (type == 2) {
            return ['rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'];
        } else {
            return ['rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'];
        }
    }

    /*
     * Function to decide color of bar border based on type
     */
function borderColors(type) {
        if (type == 1) {
            return ['rgb(255, 99, 132)',
            'rgb(255, 159, 64)'];
        } else if (type == 2) {
            return ['rgb(255, 205, 86)',
            'rgb(75, 192, 192)'];
        } else {
            return ['rgb(54, 162, 235)',
            'rgb(153, 102, 255)'];
        }
    }

var chart1 = {
    labels: ['Slow Down Pace', 'Speed Up Pace'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}

var chart2 = {
    labels: ['Speak Softer', 'Speak Louder'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}

var chart3 = {
    labels: ['Speak Slower', 'Speak Faster'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}

class Chart extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionID;
        this.type = props.type;

        this.state = {
            // chartData: chart,
            chartData1: chart1,
            chartData2: chart2,
            chartData3: chart3
        };

        var type = this.type;

        var chartData = this.state.chartData;
        var chartData1 = this.state.chartData1;
        var chartData2 = this.state.chartData2;
        var chartData3 = this.state.chartData3;

        this.chartData = this.state.chartData;
        this.title = "";
        if(type == "pace"){
            this.chartData = this.state.chartData1;
            this.title = "Pace of Speech";
        }else if(type == "volume"){
            this.chartData = this.state.chartData2;
            this.title = "Volume";
        }else if(type == "speed"){
            this.chartData = this.state.chartData3;
            this.title = "Speed"
        }

        this.db.auth().currentUser.getIdToken().then((token) => {
            fetch("/api/sessionReview/sessionData", {
                method: 'post',
                body: JSON.stringify({
                    token: token,
                    sessionID: this.sessionID
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    'predefinedFeedback' : data.predefinedFeedback,
                    'customFeedback': data.customFeedback
                })
                console.log("inside reviewchart")
                console.log(this.state.predefinedFeedback);
            })
        })

    }


    render() {
        return (
            <Bar 
                data={this.chartData} 
                options={{
                    title: {
                        display: true,
                        text: this.title,
                        fontSize: 25
                    },
                    legend: {
                        display: false
                        },
                    scales: {
                        xAxes: [{
                            display: true,
                            categoryPercentage: 0.5,
                            barPercentage: 0.8,
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMax: 20,
                                beginAtZero: true
                            }
                        }]
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    onClick: function () {
                        this.data.datasets[0].data[0] = 0;
                        this.data.datasets[0].data[1] = 0;
                        console.log(this.update);
                        this.update();
                    },
                    width: this.props.width,
                    height: this.props.height
                }}
            />
        )
    }
}

export default Chart;