mport json
from kafka import KafkaProducer
import pprint
import os
from searchtweets import ResultStream, gen_rule_payload, load_credentials, collect_results
from datetime import date
import datetime
import sys


def get_tweets(trend,date):
    enddate = date+datetime.timedelta(days=1)
    username="prashil.bhimani@colorado.edu"
    password="emojimapperspring2018"
    endpoint="https://gnip-api.twitter.com/search/fullarchive/accounts/greg-students/prod.json"
    bearer_token=""
    rule = gen_rule_payload(trend+" lang:en",from_date=date.isoformat() ,to_date=enddate.isoformat(), results_per_call=500) # testing with a sandbox account
    rs=ResultStream(rule_payload=rule,max_results=10000,max_pages=10, username=username,endpoint=endpoint, password=password)
    #tweets=collect_results(rule, result_stream_args=args,max_results=20000)
    return rs

def refine_tweet(tweet,trend,date):
    new_tweet={}
    new_tweet["message"]=tweet['text']
    new_tweet["date"]=date.isoformat()
    new_tweet["tweet_id"]=tweet['id']
    new_tweet["retweet_count"]=tweet['retweet_count']
    new_tweet["trend"]=trend
    if tweet["coordinates"]:
        new_tweet["location"]=tweet["coordinates"]["coordinates"]
        print(new_tweet)
    else:
        new_tweet["location"]= "None"
    return str(new_tweet)

def strdate_to_datetime(strdate):
    return date(int(strdate.split("-")[0]),int(strdate.split("-")[1]),int(strdate.split("-")[2]))

def push_to_stream(trend,date):
    # produce json messages
    producer = KafkaProducer(bootstrap_servers=['172.31.42.119','172.31.37.192'],value_serializer=lambda m: json.dumps(m).encode('ascii'))
    fh = open("hello.txt","w")
    text_date=strdate_to_datetime(date)
    rs=get_tweets(trend,text_date)
    for i in rs.stream():
        x=refine_tweet(i,trend,text_date)
        producer.send('twitter', x)
    fh.close()
    print("Done : " + str(trend))



os.environ["SEARCHTWEETS_USERNAME"] = "prashil.bhimani@colorado.edu"
os.environ["SEARCHTWEETS_PASSWORD"] = "emojimapperspring2018"
os.environ["SEARCHTWEETS_ENDPOINT"] = "https://gnip-api.twitter.com/search/fullarchive/accounts/greg-students/prod.json"

args=load_credentials(filename="nothing_here.yaml", yaml_key="no_key_here")
push_to_stream(sys.argv[1],sys.argv[2])
