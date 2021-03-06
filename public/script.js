const inputBody = {
  "returnFullDocumentImage": false,
  "returnFaceImage": false,
  "returnSignatureImage": false,
  "allowBlurFilter": false,
  "allowUnparsedMrzResults": false,
  "allowUnverifiedMrzResults": true,
  "validateResultCharacters": true,
  "anonymizationMode": "FULL_RESULT",
  "anonymizeImage": true,
  "ageLimit": 0,
  "imageSource": "string",
  "scanCroppedDocumentImage": false
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.microblink.com/v1/recognizers/blinkid',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});


// import 'https://unpkg.com/@microblink/blinkid-in-browser-sdk@5.16.0/ui/dist/blinkid-in-browser/blinkid-in-browser.esm.js';

// //https://www.ferraridrivingschool.com/id-received/
// const blinkId = document.querySelector('blinkid-in-browser');

// blinkId.addEventListener('fatalError', ev => {
//   console.log('fatalError', ev.detail);
// });

// blinkId.addEventListener('ready', ev => {
//   console.log('ready', ev.detail);
// });

// blinkId.addEventListener('scanError', ev => {
//   console.log('scanError', ev.detail);
// });

// blinkId.addEventListener('scanSuccess', ev => {
//   console.log('scanSuccess', ev.detail);

//     const results = ev.detail.recognizer;
//   const firstName = results.firstName || results.mrz.secondaryID;
//   const lastName = results.lastName || results.mrz.primaryID;
//   const dateOfBirth = {
//     year: results.dateOfBirth.year || results.mrz.dateOfBirth.year,
//     month: results.dateOfBirth.month || results.mrz.dateOfBirth.month,
//     day: results.dateOfBirth.day || results.mrz.dateOfBirth.day
//   }
//   console.log(results)
//   console.log(dateOfBirth)

//   doStuff(ev)
// });

// function doStuff(ev) {

//   var xhr = new XMLHttpRequest();
//   xhr.open("POST", "https://webhook.site/d87a0681-16e1-4d6e-b3ac-14d6db83512e", true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(JSON.stringify(ev.detail.recognizer));

//   // alert(
//   //   `Hello, ${ firstName } ${ lastName }!\n You were born on ${ dateOfBirth.year }-${ dateOfBirth.month }-${ dateOfBirth.day }.`
//   // );
// }

// blinkId.addEventListener('feedback', ev => {
//   console.log('feedback', ev.detail);
// });