package EmojiMapper;

import java.util.Map;
import org.json.*;
import org.apache.storm.task.ShellBolt;
import org.apache.storm.topology.*;
import org.apache.storm.tuple.Fields;
public class EmojiFilterBoltShell extends ShellBolt implements IRichBolt{

	public EmojiFilterBoltShell() {
	      super("C:\\ProgramData\\Anaconda3\\python.exe", "./EmojiFilter.py");
	    }

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("tweet"));
		// TODO Auto-generated method stub
		
	}

	public Map<String, Object> getComponentConfiguration() {
		// TODO Auto-generated method stub
		return null;
	}

}
