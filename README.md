# cpl-games

Takes a json schedule from a Canadian Premiere League team website and turns it into an ical file for importing into your favourite calendar client.

# How to

1. Go to your team's schedule page on their website
1. Use the network tab in your browser's developer tools to find the json response for the schedule
   - Look for a request to https://api.performfeeds.com/soccerdata/match/
1. Create a `data` directory in the root of the repo
1. Paste the json data into a json file in the `data` directory (ex: `data/Pacific FC.json`)
1. Install dependencies with `yarn`
1. Run the script with `TEAM_NAME="<Team Name>" yarn start`
   - Make sure the `TEAM_NAME` environment variable matches the json filename (ex: `Pacific FC` if the json filename is `Pacific FC.json`)
   - This will output an ical file with your `TEAM_NAME` (ex: `Pacific FC.ical`)
1. Import the resulting ical file into your favourite calendar client
