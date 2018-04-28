package EmojiMapper;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.storm.Config;
import org.apache.storm.StormSubmitter;
//import org.apache.storm.mongodb.bolt.MongoInsertBolt;
//import org.apache.storm.mongodb.common.mapper.MongoMapper;
//import org.apache.storm.mongodb.common.mapper.SimpleMongoMapper;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;

public class MongoInsertFilteredTweetsBolt {

    //private static final String url = "mongodb://172.31.46.223:27017/tweetsdb";
    //private static final String dbName = "tweetsdb";
    //private static final String collectionName = "filteredTweets";

  //  MongoMapper mapper = new SimpleMongoMapper()
          //  .withFields("tweets");

    //MongoInsertBolt insertBolt = new MongoInsertBolt(url, collectionName, mapper);

}
