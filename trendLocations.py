import json

# Import the necessary methods from "twitter" library
from twitter import Twitter, OAuth, TwitterHTTPError, TwitterStream

ACCESS_TOKEN = '2456854800-tq6JrUuIzcyb26mckB7EAvwFibwGOzIy3wxYSL2'
ACCESS_SECRET = 'cuYVXRYeFE3rXXlstgSFMIdwW3S08y1oJuv7m0fwOnmjo'
CONSUMER_KEY = 'KdmdqBpr6Eg6TkawHLDWQYdLX'
CONSUMER_SECRET = 'sAgM12TTzK1hbD5JsMhiRwWXipwW97fZ32Rh1z7TqjNqIR4IsI'

oauth = OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET)

twitter_stream = TwitterStream(auth=oauth)

twitter = Twitter(auth=oauth)

world_trends = twitter.trends.available()
with open('data/trend_available.json', 'w') as outfile:
    json.dump(world_trends, outfile)