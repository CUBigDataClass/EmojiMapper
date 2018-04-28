package EmojiMapper;

import org.apache.storm.Config;
import org.apache.storm.LocalCluster;
import org.apache.storm.StormSubmitter;
import org.apache.storm.generated.AlreadyAliveException;
import org.apache.storm.generated.AuthorizationException;
import org.apache.storm.generated.InvalidTopologyException;
import org.apache.storm.kafka.BrokerHosts;
import org.apache.storm.kafka.KafkaSpout;
import org.apache.storm.kafka.SpoutConfig;
import org.apache.storm.kafka.StringScheme;
import org.apache.storm.kafka.ZkHosts;
import org.apache.storm.mongodb.bolt.MongoInsertBolt;
import org.apache.storm.mongodb.common.mapper.MongoMapper;
import org.apache.storm.mongodb.common.mapper.SimpleMongoMapper;
import org.apache.storm.spout.SchemeAsMultiScheme;
import org.apache.storm.topology.TopologyBuilder;
import static org.apache.storm.cassandra.DynamicStatementBuilder.*;
import org.apache.storm.cassandra.bolt.CassandraWriterBolt;
import org.apache.storm.cassandra.query.CQLStatementTupleMapper;
//import org.apache.storm.cassandra.trident.state.CassandraMapStateFactory;
import org.apache.storm.tuple.Fields;
import org.apache.storm.utils.Utils;
import org.apache.storm.cassandra.CassandraContext;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

//import backtype.storm.LocalCluster;
//import backtype.storm.StormSubmitter;
//import backtype.storm.topology.IRichSpout;
//import backtype.storm.topology.TopologyBuilder;
//import backtype.storm.utils.Utils;

public class EmojiMapperTopology {

    public static void main(String[] args) throws Exception {
    	
        Config config = new Config();
        config.setDebug(true);

//        if (args != null && args.length > 0) {
//        	TopologyBuilder b = new TopologyBuilder();
//        	SpoutConfig kafkaConfig = new SpoutConfig(new ZkHosts("34.212.161.35:2181"), "twitter","","id");
//        	kafkaConfig.scheme =new SchemeAsMultiScheme(new StringScheme());
//        	kafkaConfig.startOffsetTime = kafka.api.OffsetRequest
//                    .EarliestTime();
//        	
//        	b.setSpout("KafkaSpout", new KafkaSpout(kafkaConfig),1);
//        	b.setBolt("FilteredTweets", new FilterTweetsBolt(),4).shuffleGrouping("KafkaSpout");
//            b.setBolt("LocationBolt", new LocationAppendBolt(),3).shuffleGrouping("FilteredTweets");
//            b.setBolt("SplitEmojiBolt", new EmojiSplitterBolt(),4).shuffleGrouping("LocationBolt");
//            b.setBolt("EmojiAggregator", new EmojiAggregatorBolt(),3).fieldsGrouping("SplitEmojiBolt", new Fields("location","date","trend"));
//            //builder.setBolt("MongoInsertFilteredTweets", new MongoInsertFilteredTweetsBolt());
//            config.setNumWorkers(6);
//            config.setNumAckers(6);
//            config.setMaxSpoutPending(1000);
//            config.setMessageTimeoutSecs(20);
//            StormSubmitter.submitTopology("HI", config, b.createTopology());
//        } else {
        	String url = "mongodb://172.31.46.223:27017/tweetsdb";
        	String dbName = "tweetsdb";
        	String collectionName = "filteredTweets";

        	MongoMapper mapper = new SimpleMongoMapper().withFields("tweets");

        	MongoInsertBolt insertBolt = new MongoInsertBolt(url, collectionName, mapper);
        	insertBolt.withBatchSize(10000);

        	TopologyBuilder builder = new TopologyBuilder();
            builder.setSpout("KafkaSpout", new TwitterStreamKafkaSpoutImitation());
            builder.setBolt("FilteredTweets", new FilterTweetsBolt()).shuffleGrouping("KafkaSpout");
            builder.setBolt("MongoInsertFilteredTweets", insertBolt).shuffleGrouping("FilteredTweets");
            //builder.setBolt("LocationBolt", new LocationAppendBolt()).shuffleGrouping("FilteredTweets");
            builder.setBolt("SplitEmojiBolt", new EmojiSplitterBolt()).shuffleGrouping("FilteredTweets");
            builder.setBolt("EmojiAggregator", new EmojiAggregatorBolt()).fieldsGrouping("SplitEmojiBolt", new Fields("location","date","trend"));
        	LocalCluster cluster = new LocalCluster();
            cluster.submitTopology("Emoji-Mapper-Topology", config, builder.createTopology());
            Utils.sleep(10000);
            //cluster.killTopology("Hello-World-BaiJian");
            //cluster.shutdown();
//        }
    }
}