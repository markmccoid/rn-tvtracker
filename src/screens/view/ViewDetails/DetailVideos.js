import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import PosterImage from "../../../components/common/PosterImage";
import { YouTubePlayIcon } from "../../../components/common/Icons";
import { useVideoData } from "../../../hooks/useVideoData";

const THUMBNAIL_WIDTH = 120 * 1.77;
const THUMBNAIL_HEIGHT = 120;

const DetailVideos = ({ movieId }) => {
  {
    //creat a flatlist to hold
    // create an play button overlay (absolute positioned?)
    //16 x 9 image ratio -> 9*1.777 x 9
    //
  }

  const [videoData, videoDataLoading] = useVideoData(movieId);

  if (videoDataLoading) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  //-- No Videos Found --
  if (videoData.length === 0 && !videoDataLoading) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontWeight: "normal", fontSize: 20 }}>No Videos Found</Text>
      </View>
    );
  }
  //-- Render found videos --
  return (
    <View style={{ flexDirection: "row" }}>
      <ScrollView horizontal>
        {videoData &&
          videoData.map((video) => {
            return (
              <TouchableOpacity
                key={video.id}
                style={{
                  marginHorizontal: 10,
                }}
                onPress={() => Linking.openURL(video.videoURL)}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{video.type}</Text>
                <View
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    top: THUMBNAIL_HEIGHT / 2 - 15,
                    left: THUMBNAIL_WIDTH / 2 - 30,
                  }}
                >
                  <YouTubePlayIcon size={60} style={{ opacity: 0.7 }} />
                </View>

                <PosterImage
                  uri={video.videoThumbnailURL}
                  posterWidth={THUMBNAIL_WIDTH}
                  posterHeight={THUMBNAIL_HEIGHT}
                  style={{
                    borderRadius: 10,
                    opacity: 0.7,
                    borderColor: "#777",
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default DetailVideos;

const styles = StyleSheet.create({});
