package EmojiMapper;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.ServerAddress;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;

import org.bson.Document;
import java.util.Arrays;
import com.mongodb.Block;

import com.mongodb.client.MongoCursor;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.result.DeleteResult;
import static com.mongodb.client.model.Updates.*;
import com.mongodb.client.result.UpdateResult;
import java.util.ArrayList;
import java.util.List;

import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Values;
import org.json.simple.JSONObject;
public class EmojiAggregatorBolt extends BaseRichBolt{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private OutputCollector collector;
	private HashMap<String, Integer> aggregate_map;
	int count;
	
	public void execute(Tuple t) {
		// TODO Auto-generated method stub
		String tweet_obj = (String) t.getValue(0)+"|"+(String) t.getValue(1)+"|"+(String) t.getValue(2);

			Integer value = aggregate_map.get(tweet_obj);
			if (value == null)
			{
				value = 0;
				
			}
			value++;
			aggregate_map.put(tweet_obj, value);
			count++;
			System.out.println(count);
			if ((count % 100) == 0)
			{
				Iterator it = aggregate_map.entrySet().iterator();
			    while (it.hasNext()) {
			    	MongoClient mongoClient = new MongoClient( "" , 27017 );
			        Map.Entry pair = (Map.Entry)it.next();
			        System.out.println(pair.getKey() + " = " + pair.getValue());
		
			    }
				
			}
		
	}

	public void prepare(Map arg0, TopologyContext arg1, OutputCollector collector) {
		// TODO Auto-generated method stub
		this.collector = collector;
		this.count=0;
		aggregate_map = new HashMap<String,Integer>();
		
	}

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		// TODO Auto-generated method stub
		declarer.declare(new Fields("obj","aggregated_count"));
		
	}

}
