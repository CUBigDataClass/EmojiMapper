package EmojiMapper;
import java.util.Map;
import java.util.Random;

import org.apache.storm.topology.IRichSpout;

import org.apache.storm.kafka.KafkaSpout;
import org.apache.storm.kafka.SpoutConfig;

import org.apache.storm.Config;

import org.apache.storm.spout.SpoutOutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichSpout;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Values;
import org.apache.storm.utils.Utils;

public class TwitterStreamKafkaSpoutImitation extends BaseRichSpout{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	SpoutOutputCollector _collector;
	int count=0;
	Random _rand;
	@Override
	public void nextTuple() {
		// TODO Auto-generated method stub
		Utils.sleep(100);
		String[] s={
				"{'message':'S1','date':'2106-10-01','tweet_id':12012,'retweet_count':121, 'trend':'#Mc'}",
				"{'message':'S2','date':'2106-10-01','tweet_id':12012,'retweet_count':121, 'trend':'#Mc'}",
				"{'message':'S3','date':'2106-10-01','tweet_id':12012,'retweet_count':121, 'trend':'#Mc'}",
				"{'message':'S4','date':'2106-10-01','tweet_id':12012,'retweet_count':121, 'trend':'#Mc'}",
				"{'message':'S5','date':'2106-10-01','tweet_id':12012,'retweet_count':121, 'trend':'#Mc'}"};
		_collector.emit(new Values(s[count%5]));
		count++;
		
	}

	@Override
	public void open(Map args0, TopologyContext arg1, SpoutOutputCollector collector) {
		// TODO Auto-generated method stub
		_collector = collector;
		
		_rand = new Random();
	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		
		declarer.declare(new Fields("tweet"));
	}

	

}