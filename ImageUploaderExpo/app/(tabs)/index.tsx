import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View, Dimensions, FlatList, Image, SafeAreaView, Pressable } from "react-native";

const placeHolderImage = require("@/assets/images/background-image.png");
const numColumns = 3;
const imageMargin = 8;
const screenWidth = Dimensions.get("window").width;
const imageSize = (screenWidth - (numColumns + 1) * imageMargin) / numColumns;

export default function Index() {
  const [selectedAssets, setSelectedAssets] = useState<ImagePicker.ImagePickerAsset[] | undefined>(undefined);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 0,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedAssets(result.assets);
    }
  };


  // Sends image to backend
  const uploadImage = async () => {
    if (!selectedAssets?.length) return;

    const formData = new FormData();
    for (const asset of selectedAssets) {
      // @ts-expect-error: special react native format for form data
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop(),
        type: asset.mimeType,
      });

      if (asset.exif) {
        formData.append("exif", JSON.stringify(asset.exif));
      }
    }

    const res = await fetch("http://192.168.0.157:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    console.log("Raw response text:", text);

    try {
      const data = JSON.parse(text);
      console.log("Upload:", data);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  };

  // function formDataFromImagePicker(result: ImagePicker.ImagePickerSuccessResult) {
  //   const formData = new FormData();

  //   for (const index in result.assets) {
  //     const asset = result.assets[index];

  //     // @ts-expect-error: special react native format for form data
  //     formData.append(`file`, {
  //       uri: asset.uri,
  //       name: asset.fileName ?? asset.uri.split("/").pop(),
  //       type: asset.mimeType,
  //     });

  //     if (asset.exif) {
  //       formData.append(`exif.${index}`, JSON.stringify(asset.exif));
  //     }
  //   }

  //   return formData;
  // }



  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        {
          selectedAssets && selectedAssets.length > 0 ? (
            <FlatList
              data={selectedAssets}
              numColumns={numColumns}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <Image source={item} style={styles.listImage} />
              )}
            />
          ) : (
            <Image source={placeHolderImage} />
          )
        }
      </View>
      <View style={styles.footerContainer}>
        <Button label="Choose some photos" theme="primary" onPress={pickImageAsync} />
        {selectedAssets?.length &&
          <Button label={`upload ${selectedAssets.length > 1 ? "these photos" : "this photo"} `} onPress={uploadImage} />
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: '#0e223b',
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  footerContainer: {
    flex: 1 / 3,
    justifyContent: 'flex-end',
    gap: 10,
  },

  flatList: {
    overflow: 'scroll',
  },

  text: {
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: 5,
    textAlign: 'center',
  },
  listImage: {
    width: imageSize,
    height: imageSize,
    margin: imageMargin / 2
  }
});