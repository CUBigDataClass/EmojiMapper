from kafka import KafkaProducer
import json
import pprint
import os
from searchtweets import ResultStream, gen_rule_payload, load_credentials, collect_results
from datetime import date
import datetime

def get_tweets(trend,date):
    enddate = date+datetime.timedelta(days=1)
    rule = gen_rule_payload(trend+" lang:en",from_date=date.isoformat() ,to_date=enddate.isoformat(), results_per_call=500) # testing with a sandbox account
    tweets=collect_results(rule, result_stream_args=args,max_results=20000)
    return tweets

def refine_tweet(tweet,trend,date):
    new_tweet={}
    new_tweet["message"]=tweet['text']
    new_tweet["date"]=date.isoformat()
    new_tweet["tweet_id"]=tweet['id']
    new_tweet["retweet_count"]=tweet['retweet_count']
    new_tweet["trend"]=trend
    new_tweet["place"]=place
    return new_tweet



def strdate_to_datetime(strdate):
    return date(int(strdate.split("-")[0]),int(strdate.split("-")[1]),int(strdate.split("-")[2]))

def get_reverse_trends():
    reverse_trend={}
    with open("data/reverse_index.json","r") as b:
        reverse_trend=json.load(b)
    new_reverse_trend={}
    for i in reverse_trend.keys():
        for j in reverse_trend[i].keys():
            new_reverse_trend[j]=reverse_trend[i][j]
    return new_reverse_trend

def get_search_list(start_date,end_date):
    trends=get_reverse_trends()
    search_list=[]
    for date in trends.keys():
        if start_date<=strdate_to_datetime(date)<=end_date:
            for i in trends[date]:
                search_list.append([i,start_date])
    return search_list



def push_to_stream(start_date,end_date):
    # produce json messages
    producer = KafkaProducer(bootstrap_servers=['172.31.22.45:9092'],value_serializer=lambda m: json.dumps(m).encode('ascii'))
    search_list=get_search_list(start_date,end_date)
    for query in search_list:
        tweets=get_tweets(query[0],query[1])
        
        for i in tweets:
            #print(refine_tweet(i))
            producer.send('TwitterStream', refine_tweet(i,query[0],query[1]))
        print("Done : " + str(query))


os.environ["SEARCHTWEETS_USERNAME"] = "prashil.bhimani@colorado.edu"
os.environ["SEARCHTWEETS_PASSWORD"] = "emojimapperspring2018"
os.environ["SEARCHTWEETS_ENDPOINT"] = "https://gnip-api.twitter.com/search/fullarchive/accounts/greg-students/prod.json"

args=load_credentials(filename="nothing_here.yaml", yaml_key="no_key_here")
push_to_stream(date(2016,10,1),date(2016,10,30))
