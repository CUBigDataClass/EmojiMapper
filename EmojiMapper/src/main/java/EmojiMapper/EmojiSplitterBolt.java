package EmojiMapper;

import java.util.List;
import java.util.Map;

import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.vdurmont.emoji.EmojiParser;

public class EmojiSplitterBolt extends BaseRichBolt{
	private OutputCollector collector;
	JSONParser parser;
	
	public void execute(Tuple t) {
		String msg = t.getString(0);
		JSONObject jsonObj = null;
		try {
			jsonObj = (JSONObject)parser.parse(msg);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<String> result=EmojiParser.extractEmojis((String)jsonObj.get("message"));
		for(String emoji : result) {
			JSONObject e=new JSONObject();
			e.put("emoji",emoji);
			e.put("trend", (String)jsonObj.get("trend"));
			//e.put("location", (String)jsonObj.get("location"));
			e.put("date", (String)jsonObj.get("date"));
			collector.emit(new Values(emoji,(String)jsonObj.get("location"),(String)jsonObj.get("date"),(String)jsonObj.get("trend")));
		}
		// TODO Auto-generated method stub
		
	}

	public void prepare(Map arg0, TopologyContext arg1, OutputCollector arg2) {
		// TODO Auto-generated method stub
		this.collector=arg2;
		this.parser=new JSONParser();
		
		
	}

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		// TODO Auto-generated method stub
		declarer.declare(new Fields("emoji","date","trend"));
		
	}
	

}
