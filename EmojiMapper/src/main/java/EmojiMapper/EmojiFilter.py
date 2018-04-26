import storm
import emoji
import json

class EmojiFilterBolt(storm.BasicBolt):
    def process(self, tup):
    	tweet=json.loads(tup)
        emojis = ''.join(c for c in tweet["message"] if c in emoji.UNICODE_EMOJI)
        if len(emojis)>0:
        	storm.emoit(json.dumps(tweet))

SplitSentenceBolt().run()