# EmojiMapper

### Project Overview

Using the twitter search API we plan to get tweets that were trending in every locations

### Basic Architecture

 Producer ->  KafkaSpout(Tweet, Trend and date) -> Bolt(filtering tweets with emojis) (database )-> Bolt(EmojiTweets -> assign a date and location and trend) -> aggregate(+retweets) -> Bolt(push in database)  -> UI (D3) 
