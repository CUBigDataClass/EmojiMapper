package EmojiMapper;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class LocationAppendBolt extends BaseRichBolt{
	JSONObject trendDatabase;
	JSONParser parser;
	private OutputCollector collector;
	public void prepare(Map conf, TopologyContext context, OutputCollector collector) {
		this.collector = collector;
		this.parser=new JSONParser();
		try {
			this.trendDatabase=(JSONObject)parser.parse(new FileReader("./reverse_index.json"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
	
	public void execute(Tuple t) {
		String msg = t.getString(0);
		JSONObject jsonObj = null;
		try {
			jsonObj = (JSONObject)parser.parse(msg);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String month=(String)jsonObj.get("date");
		month=month.split("-")[1];
		JSONObject monthlydata=(JSONObject)trendDatabase.get(month);
		JSONObject daily_data=(JSONObject)monthlydata.get((String)jsonObj.get("date"));
		List<String> locations= (List<String>)daily_data.get((String)jsonObj.get("trend"));
		jsonObj.put("location","");
		for( String l :locations){
			jsonObj.put("location", l);
			collector.emit(new Values(jsonObj.toString()));
		}
		
		// TODO Auto-generated method stub
		
	}

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		// TODO Auto-generated method stub
		declarer.declare(new Fields("locationedtweet"));
		
	}

	

}
