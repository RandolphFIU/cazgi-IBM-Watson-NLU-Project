const express = require('express');
const app = new express();

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
          apikey: api_key,
        }),
        serviceUrl: api_url,
      });

      return naturalLanguageUnderstanding;
}


  let analyzeParamsText = {
    'text': '',
    'features': {
        'emotion': {
          },
        'sentiment': {
          },
    },
  };

  let analyzeParamsUrl = {
    'url': '',
    'features': {
        'emotion': {
        },
      'sentiment': {
        },
    },
  };

  let analyzeParamsTextSentiment = {
    'text': '',
    'features': {
        'sentiment': {
          }
        }
  };

  let analyzeParamsURLSentiment = {
    'url': '',
    'features': {
        'sentiment': {
          }
        }
  };



app.use(express.static('client'))
const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

// ENDPOINTS ///////////////////////////////////////////////////

app.get("/url/emotion", (req,res) => {

    console.log(req.query);
    console.log(req.query.url);

    analyzeParamsUrl.url = req.query.url;
    let emotions;

    getNLUInstance().analyze(analyzeParamsUrl)
    .then(analysisResults => {

        emotions = JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2);
        console.log("\nWasabi\n" + emotions);
        return res.send(emotions);;
      })
      .catch(err => {
        console.log('error:', err);
      });   

});

app.get("/url/sentiment", (req,res) => {

    console.log(req.query);
    console.log(req.query.url);

    analyzeParamsURLSentiment.url = req.query.url;
    let sentiment;

    getNLUInstance().analyze(analyzeParamsURLSentiment)
    .then(analysisResults => {

        sentiment = JSON.stringify(analysisResults.result.sentiment.document, null, 2);
        console.log("\nWasabi\n" + sentiment);
        return res.send(JSON.stringify(sentiment, null, 2));;
      })
      .catch(err => {
        console.log('error:', err);
      });   

    // return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {


    analyzeParamsText.text = req.query.text;
    console.log(analyzeParamsText)
    let emotions;

    getNLUInstance().analyze(analyzeParamsText)
    .then(analysisResults => {

        //emotions = JSON.stringify(analysisResults.result.keywords[0].emotion, null, 2);
        emotions = JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2);
        console.log("\nWasabi\n" + emotions);
        return res.send(emotions);;
      })
      .catch(err => {
        console.log('error:', err);
      });     

});

app.get("/text/sentiment", (req,res) => {

    // console.log(req.query);
    console.log(req.query.text);

    analyzeParamsTextSentiment.text = req.query.text;
    let sentiment;

    getNLUInstance().analyze(analyzeParamsTextSentiment)
    .then(analysisResults => {

        sentiment = JSON.stringify(analysisResults.result.sentiment.document, null, 2);
        console.log("\nWasabi\n" + sentiment);
        return res.send(JSON.stringify(sentiment, null, 2));;
      })
      .catch(err => {
        console.log('error:', err);
      });  

}); 

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

