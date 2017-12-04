
import React, { Component } from 'react';
import './styles/CreateSession.css';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';

import './styles/ReviewFeedback.css';
import ReviewChart from './components/ReviewChart';
import SessionHistory from './SessionHistory';
import Main from './Main';

import { ReactMic } from 'react-mic';
import {getDisplayName} from "./RegisterFirebaseUser";

import logo from './Logo.png';

class ReviewFeedback extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionid;

        this.state = {
            predefinedFeedback: [],
            customFeedback: [],
            blobObject: null,
            display: "",
            src: ""
        };

        setInterval(() => {
            if (this.state.ready) {
                console.log(this.player.getCurrentTime());
            }
        }, 1000)
    }

    componentWillMount() {
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
                console.log(data.customFeedback)
                this.setState({
                    'predefinedFeedback' : data.predefinedFeedback ? data.predefinedFeedback : [],
                    'customFeedback': data.customFeedback ? data.customFeedback : []
                })
            })
        })


    }

    main = function(ev) {

        ev.preventDefault();
        ReactDOM.render(<Main db={this.db} />, document.getElementById('root'));


    }

    componentDidMount(){
        getDisplayName().then(name =>{this.setState({display: name});})

        var storage = this.db.storage();
        var gsReference = storage.refFromURL('gs://speakeasy-25a66.appspot.com');
        var childURL = this.sessionID + "/media";

        gsReference.child(childURL).getDownloadURL().then(function(url){
            console.log(url);
            this.setState({'src': url});
        }.bind(this)).catch(function(error){
            console.log(error);
        });
    }

    history = function(ev){
        //ev.preventDefault();
        ReactDOM.render(<SessionHistory db={this.db} />, document.getElementById('root'));
    };

    formatTimestamp = (timestamp) => {
        let seconds = Math.floor(parseFloat(timestamp));

        var minutes = Math.floor(seconds / 60);
        seconds = seconds - (minutes * 60);

        minutes = minutes.toString().length > 1 ? minutes.toString() : "0".repeat(2 - minutes.toString().length) + minutes.toString();
        seconds = seconds.toString().length > 1 ? seconds.toString() : "0".repeat(2 - seconds.toString().length) + seconds.toString();

        return minutes.toString() + ":" + seconds.toString();
    }

    render() {

        return (

            <div style={{width:'100%',height:'100%',borderBottom:'1px solid #F3E6DE',zIndex:'9' }}>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{backgroundColor:'#333333',height:"100%"}}>
                    <h2 style={{marginLeft:'8px',marginTop:'0px',marginBottom:'0px',height:'50px', color:'white'}}><b></b>
                        <img src={logo} width="125" height="50" style={{cursor:'pointer'}} onClick={this.main.bind(this)}/>
                    </h2>
                </div>

                <div id="navigation" class="w3-sidebar w3-bar-block w3-responsive" style={{height:'100%',backgroundColor:'#585858',zIndex:'0', color:'#F3E6DE', boxShadow:'1px 1px 2px #525252'}}>

                    <a id='display' class="w3-bar-item HoverRed" style={{fontSize:'20px', outline:'2px solid #333333'}}><b>{this.state.display}</b></a>
                    <a class="w3-bar-item w3-button w3-hover-red" onClick={this.history.bind(this)} style={{color:'white', boxShadow:'1px 0px 1px #333333'}}><b>Session History</b></a>


                </div>

                <div id="center" style={{width:'85%',float:'right',marginTop:'4px',height:'100%'}}>
                    <div id= 'innerReview' style={{width:'65%',display:'inline-block',float:'left',margin:'auto'}}>
                        <audio
                            id="audio"
                            controls={true}
                            src={this.state.src}
                        />
                    </div>


                    <div id= 'chartReview' style={{width:'65%',height:'30em',display:'inline-block',float:'left'}}>
                        <div class='chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart type='pace' data={this.state.predefinedFeedback}/>

                        </div>
                        <div class="chart"style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart type='volume'/>

                        </div>
                        <div class = 'chart' style={{width:'33%',display:'inline-block',height:'100%'}}>

                            <ReviewChart type='clarity' />
                        </div>
                    </div>

                    <div id='titleReview' style={{width:'35%',display:'inline-block',float:'both',overflow:'auto'}}>
                        <center><h3>
                        Feedback
                        </h3>
                        </center>
                    </div>

                    <div id = 'rightReview' class='w3-round' style={{float:'right',border:'2px solid #f44336',width:'35%',backgroundColor:'#585858',overflow:'auto',maxHeight:'33em'}}>

                            {
                                this.state.customFeedback.map((feedbackData) => (
                                    <div class="reviewContainer w3-round-xlarge">
                                        <p class="reviewContent">Display Name: {feedbackData.uid}</p>
                                        <p class="reviewContent">Timestamp: {this.formatTimestamp(feedbackData.timestamp)}</p>
                                        <p class="reviewContent">{feedbackData.message}</p>
                                    </div>
                                ))

                            }

                    </div>




                </div>



            </div>
        );
    }
}

export default ReviewFeedback;
