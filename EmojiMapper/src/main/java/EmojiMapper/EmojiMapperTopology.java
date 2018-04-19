package EmojiMapper;
import org.apache.storm.kafka.*;
import org.apache.storm.topology.IRichBolt;
import org.apache.storm.topology.IRichSpout;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.*;
import org.apache.storm.utils.Utils;
import org.apache.storm.Config;
import org.apache.storm.LocalCluster;
import org.apache.storm.StormSubmitter;

//import backtype.storm.LocalCluster;
//import backtype.storm.StormSubmitter;
//import backtype.storm.topology.IRichSpout;
//import backtype.storm.topology.TopologyBuilder;
//import backtype.storm.utils.Utils;

public class EmojiMapperTopology {

    public static void main(String[] args) throws Exception {
    	//SpoutConfig kafkaConfig = new SpoutConfig(new ZkHosts("localhosts"), "TwitterSpream", null, null);
        TopologyBuilder builder = new TopologyBuilder();
        builder.setSpout("KafkaSpout", new TwitterStreamKafkaSpoutImitation() , 2);
        builder.setBolt("FilteredTweets", new FilterTweetsBolt()).shuffleGrouping("KafkaSpout");
       
        Config config = new Config();
        config.setDebug(true);

        if (args != null && args.length > 0) {
            config.setNumWorkers(6);
            config.setNumAckers(6);
            config.setMaxSpoutPending(100);
            config.setMessageTimeoutSecs(20);
            StormSubmitter.submitTopology(args[0], config, builder.createTopology());
        } else {
            LocalCluster cluster = new LocalCluster();
            cluster.submitTopology("Emoji-Mapper-Topology", config, builder.createTopology());
            Utils.sleep(10000);
            //cluster.killTopology("Hello-World-BaiJian");
            //cluster.shutdown();
        }
    }
}