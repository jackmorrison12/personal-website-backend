const express = require('express');
const app = express();
var cors = require('cors');
const axios = require('axios');

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

app.get('/', (req, res) => res.send('Working!!!'));

app.get('/stars', (req,res) => {

  axios.get(`https://api.github.com/repos/${process.env.GITHUB_USERNAME}/personal-website`).then(resp => {
    res.send(resp.data.stargazers_count.toString());
  });

});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 5000', '');
});
