package EmojiMapper;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.json.simple.JSONObject;
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
				if(!result.isEmpty()) {
					collector.emit(
							new Values(
									(String)jsonObj.get("message"),
									(String)jsonObj.get("date"),
									(String)jsonObj.get("trend"),
									jsonObj.get("tweet_id"),
									jsonObj.get("retweet_count")
									)
							);
				}
			}
		}
    }

    public void declareOutputFields(OutputFieldsDeclarer declarer) {
        declarer.declare(new Fields("tweet","date","trend","tweet_id","retweet_count"));
    }


}