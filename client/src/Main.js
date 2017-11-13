import React, { Component } from 'react';
import firebase from 'firebase';
import Users from './components/Users.js';
import DisplayUserData from './components/DisplayUserData.js';
import './styles/App.css';

import Join from './Join';
import AppFront from './App';
import CreateSession from './CreateSession';

import ReactDOM from 'react-dom';
class App extends Component {

    constructor(props) {
        super(props);
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDSQVw9KUjmxhlxILCousROVR6PfOFcYQg",
            authDomain: "speakeasy-25a66.firebaseapp.com",
            databaseURL: "https://speakeasy-25a66.firebaseio.com",
            projectId: "speakeasy-25a66",
            storageBucket: "speakeasy-25a66.appspot.com",
            messagingSenderId: "836790794762"
        };
        !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

        this.state = {
            message: ""
        }
    }

    componentDidMount() {
        return fetch('/api/hello')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    message: responseJson.message
                });
            })
    }

    front(e) {
        ReactDOM.render(<AppFront />, document.getElementById('root'));


    }
    join(e){

        ReactDOM.render(<Join />, document.getElementById('root'));

    }

    create(e) {

        ReactDOM.render(<CreateSession />, document.getElementById('root'));
    }

    render() {
        return (

            <div >
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

                <div style={{height:'75px'}}>
                    <div style={{backgroundColor:'CornFlowerBlue',height:"100%"}}>

                        <center>
                            <h1 style={{marginLeft:'10px',marginTop:'0px',marginBottom:'1px',height:'35px',fontFamily:'cursive'}}><b>speakeasy</b>


                            </h1>
                        </center>

                    </div>
                </div>

                <div class="w3-sidebar w3-bar-block" style={{width:'20%',height:'100%',backgroundColor:'lightgrey',zIndex:'0',overflow:'hidden'}}>

                    <a href="#" class="w3-bar-item" style={{backgroundColor:'aqua'}}>Michael Harasti</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Profile Settings</a>
                    <a href="#" class="w3-bar-item w3-button" style={{backgroundColor:'lightgrey'}}>Session History</a>
                    <a href="#" class="w3-bar-item w3-button" onClick={this.front} style={{backgroundColor:'lightgrey'}}>Logout</a>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>




                <div style={{overflow:'hidden'}}>


                    <div style={{float:'left',width:"30%", marginLeft:'310px',marginTop:'100px'}}>
                        <p style={{width:'', overflow:'hidden'}}>Are you about to give a speech? If you answered yes then click "Create a Session" in which audience members can join and give feedback to your speech</p>

                    </div>

                    <div style={{width:'30%',marginRight:'70px',marginTop:'100px',float:'right'}}>
                        <p style={{width:'',overflow:'hidden'}}>Are you an audience member of a speech? If you answered yes then click "Join Session" in which you will be able to provide feedback to whoevers speech you are listening to</p>

                    </div>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>


                <div>
                    <div class='w3-round' style={{width:'30%', float:'left', marginLeft:'300px'}}>

                        <center>
                        <h6>Enter Session Code:</h6>
                        <input></input>
                        <br></br>
                        <br></br>


                        <button class="w3-btn w3-large w3-round" onClick={this.create} style={{backgroundColor:'steelblue'}}>Create a Session</button>
                        </center>
                    </div>
                    <div class='w3-round' style={{width:'30%',float:'right',marginRight:'100px',marginTop:'99px'}}>
                        <center>
                        <button class="w3-btn w3-large w3-round" onClick={this.join} style={{backgroundColor:'powderblue'}}>Join a Session</button>
                        </center>
                    </div>


                </div>


            </div>

        );
    }
}

export default App;