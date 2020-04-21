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
                                              commits: responseTwo.data[0].total}
                                            })
      }))

      .catch(errors => {
        res.send({success : false, message: error.message})
      })

});

app.get('/lastfm', (req,res) => {

  let one = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${process.env.LASTFM_USERNAME}&api_key=${process.env.LASTFM_API_KEY}&limit=1&nowplaying=true&format=json`
  let two = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${process.env.LASTFM_USERNAME}&api_key=${process.env.LASTFM_API_KEY}&period=7day&limit=1&format=json`

  const requestOne = axios.get(one);
  const requestTwo = axios.get(two);

  axios.all([requestOne, requestTwo])
      .then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        res.send({success : true , response: {top_song: {name: responseTwo.data.toptracks.track[0].name, artist: responseTwo.data.toptracks.track[0].artist.name}, 
                                              last_song: { name: responseOne.data.recenttracks.track[0].name, artist: responseOne.data.recenttracks.track[0].artist['#text']}}
                })
      }))

      .catch(errors => {
        res.send({success : false, message: error.message})
      })

});

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 5000', '');
});
