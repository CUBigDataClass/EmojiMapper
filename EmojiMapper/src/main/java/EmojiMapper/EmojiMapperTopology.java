package EmojiMapper;
import org.apache.storm.kafka.*;
import org.apache.storm.spout.SchemeAsMultiScheme;
import org.apache.storm.topology.IRichBolt;
import org.apache.storm.topology.IRichSpout;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.*;
import org.apache.storm.tuple.Fields;
import org.apache.storm.utils.Utils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    	
        Config config = new Config();
        config.setDebug(true);

        if (args != null && args.length > 0) {
        	TopologyBuilder builder = new TopologyBuilder();
        	SpoutConfig kafkaConfig = new SpoutConfig(new ZkHosts(args[1]), "TwitterStream", "/storm","storm");
        	kafkaConfig.scheme =new SchemeAsMultiScheme(new StringScheme());
        	List<String> zk= new ArrayList<String>();
        	zk.add(args[1]);
        	kafkaConfig.zkServers=zk;
        	kafkaConfig.ignoreZkOffsets=true;
        	builder.setSpout("KafkaSpout", new KafkaSpout(kafkaConfig),5);
        	builder.setBolt("FilteredTweets", new FilterTweetsBolt(),4).shuffleGrouping("KafkaSpout");
            builder.setBolt("LocationBolt", new LocationAppendBolt(),3).shuffleGrouping("FilteredTweets");
            builder.setBolt("SplitEmojiBolt", new EmojiSplitterBolt(),4).shuffleGrouping("LocationBolt");
            builder.setBolt("EmojiAggregator", new EmojiAggregatorBolt(),3).fieldsGrouping("SplitEmojiBolt", new Fields("location","date","trend"));
            //builder.setBolt("MongoInsertFilteredTweets", new MongoInsertFilteredTweetsBolt());
            config.setNumWorkers(6);
            config.setNumAckers(6);
            config.setMaxSpoutPending(100);
            config.setMessageTimeoutSecs(20);
            StormSubmitter.submitTopology(args[0], config, builder.createTopology());
        } else {
        	TopologyBuilder builder = new TopologyBuilder();
            builder.setSpout("KafkaSpout", new TwitterStreamKafkaSpoutImitation());
            builder.setBolt("FilteredTweets", new FilterTweetsBolt()).shuffleGrouping("KafkaSpout");
            builder.setBolt("LocationBolt", new LocationAppendBolt()).shuffleGrouping("FilteredTweets");
            builder.setBolt("SplitEmojiBolt", new EmojiSplitterBolt()).shuffleGrouping("LocationBolt");
            builder.setBolt("EmojiAggregator", new EmojiAggregatorBolt()).fieldsGrouping("SplitEmojiBolt", new Fields("location","date","trend"));
        	LocalCluster cluster = new LocalCluster();
            cluster.submitTopology("Emoji-Mapper-Topology", config, builder.createTopology());
            Utils.sleep(10000);
            //cluster.killTopology("Hello-World-BaiJian");
            //cluster.shutdown();
        }
    }
}