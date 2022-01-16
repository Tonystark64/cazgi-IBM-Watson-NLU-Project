import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
  /*
  We are setting the component as a state named innercomp.
  When this state is accessed, the HTML that is set as the 
  value of the state, will be returned. The initial input mode
  is set to text
  */
  state = {
    innercomp: <textarea rows="8" cols="80" id="textinput" />,
    mode: "text",
    sentimentOutput: [],
    sentiment: true
  }

  /*
  This method returns the component based on what the input mode is.
  If the requested input mode is "text" it returns a textbox with 4 rows.
  If the requested input mode is "url" it returns a textbox with 1 row.
  */

  renderOutput = (input_mode) => {
    let rows = 3
    let mode = "url"
    //If the input mode is text make it 4 lines
    if (input_mode === "text") {
      mode = "text"
      rows = 8
    }
    this.setState({
      innercomp: <textarea rows={rows} cols="80" id="textinput" />,
      mode: mode,
      sentimentOutput: [],
      sentiment: true
    });
  }

  sendForSentimentAnalysis = () => {
    this.setState({ sentiment: true });
    let url = ".";
    let mode = this.state.mode
    url = url + "/" + mode + "/sentiment?" + mode + "=" + document.getElementById("textinput").value;
    fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }, mode: 'cors', cache: 'default'
    }).then((res) => res.json())
      .then((data) => {
        let color = "gold";
        switch (data.label) {
          case "positive": color = "green"; break;
          case "negative": color = "red"; break;
          default: break;
        }
        let output = <div style={{ color: color, fontSize: 20 }}>{data.label}</div>;
        this.setState({ sentimentOutput: output });
      });
  }

  sendForEmotionAnalysis = () => {

    this.setState({ sentiment: false });
    let url = ".";
    let mode = this.state.mode
    url = url + "/" + mode + "/emotion?" + mode + "=" + document.getElementById("textinput").value;
    fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }, mode: 'cors', cache: 'default'
    }).then((res) => res.json())
      .then((data) => {
        this.setState({ sentimentOutput: <EmotionTable emotions={data} /> });
      })
  }

  render() {
    return (
      <div className="App">
        <button className="btn btn-info" onClick={() => { this.renderOutput('text') }}>Text</button>
        <button className="btn btn-dark" onClick={() => { this.renderOutput('url') }}>URL</button>
        <br /><br />
        <p>Remember to click "Text" or "URL" button above before input, otherwise desired result cannot be shown.</p>
        <p>The result will be rendered in about 5-10 seconds, please kindly wait patiently.</p>
        {this.state.innercomp}
        <br />
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br />
        {this.state.sentimentOutput}
      </div>
    );
  }
}

export default App;
