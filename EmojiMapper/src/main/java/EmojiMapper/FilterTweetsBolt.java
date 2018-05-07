package EmojiMapper;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.json.simple.*;
import org.json.simple.parser.*;

import com.vdurmont.emoji.EmojiParser;

public class FilterTweetsBolt extends BaseBasicBolt {

    public void execute(Tuple tuple, BasicOutputCollector collector) {
        String msg = tuple.getString(0);
        msg=msg.replaceAll("'", "\"");
        msg = msg.replaceAll("^\"|\"$", "");
        JSONParser parser =new JSONParser();
        JSONObject jsonObj = null;
		try {
			jsonObj = (JSONObject)parser.parse(msg);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(jsonObj!=null) {
			if((String)jsonObj.get("message")!=null) {
				List<String> result=EmojiParser.extractEmojis((String)jsonObj.get("message"));
				String tweet=(String)jsonObj.get("message");
				String date=(String)jsonObj.get("date");
				String query=(String)jsonObj.get("trend");
				
				
				String listEmoji="";
				for(String emoji: result) {
					listEmoji=listEmoji +" "+emoji;
				}
				Long tweet_id=(Long)jsonObj.get("tweet_id");
				Long rt_count=(Long) jsonObj.get("retweet_count");
				String locations = (String) jsonObj.get("location");
				
				
				String[] cordinates= locations.split(" ");
				JSONArray list = new JSONArray();
		        list.add(Float.parseFloat(cordinates[0]));
		        list.add(Float.parseFloat(cordinates[1]));
				
		    	boolean hasLocation=true;
		    	if(Float.parseFloat(cordinates[0])==-1){
		    		hasLocation=false;
		    	}
				boolean hasEmoji=false;
				if(!result.isEmpty()) {
					hasEmoji=true;
				}
				collector.emit(new Values(tweet,date,query,tweet_id,rt_count,list,hasEmoji, listEmoji, hasLocation));
			}
		}
    }

    public void declareOutputFields(OutputFieldsDeclarer declarer) {
        declarer.declare(new Fields("tweet","date","query","tweet_id","retweet_count","location","hasEmoji", "listEmoji", "hasLocation" ));
    }


}