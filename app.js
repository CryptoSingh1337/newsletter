const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const port = 8080;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/failure", (req, res) => {
    res.redirect("/");
})

app.post("/", (req, res) => {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/1ccd4f391d";
    const options = {
        method: "POST",
        auth: "lunatic:1c4cd4572f97632eeead1029ef419e46-us7"
    }

    const request = https.request(url, options, (response) => {
        const statusCode = response.statusCode;
        if(statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port: " + port);
});

//API Key
//1c4cd4572f97632eeead1029ef419e46-us7

//List ID
// 1ccd4f391d