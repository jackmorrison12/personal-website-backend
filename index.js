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

app.get('/github', (req,res) => {

  let one = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/personal-website`
  let two = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/personal-website/stats/contributors`

  const requestOne = axios.get(one);
  const requestTwo = axios.get(two);

  axios.all([requestOne, requestTwo])
      .then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        res.send({success : true , response: {stars: responseOne.data.stargazers_count, 
                                        updated: responseOne.data.updated_at, 
                                        watchers: responseOne.data.watchers,
                                        forks: responseOne.data.forks,
                                        commits: responseTwo.data[0].total}})}))

      .catch(errors => {
        res.send({success:false, message: error.message})
      })

});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 5000', '');
});
