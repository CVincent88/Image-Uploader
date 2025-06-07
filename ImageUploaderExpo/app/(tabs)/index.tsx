import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View, Dimensions, FlatList, Image, SafeAreaView, ActivityIndicator } from "react-native";

// Placeholder image shown when no images are selected
const placeHolderImage = require("@/assets/images/background-image.png");
const ipAddress = "192.168.0.157";
// Grid configuration
const numColumns = 3;
const imageMargin = 8;
const screenWidth = Dimensions.get("window").width;
const imageSize = (screenWidth - (numColumns + 1) * imageMargin) / numColumns;

export default function Index() {
  // State to store selected image assets
  const [selectedAssets, setSelectedAssets] = useState<ImagePicker.ImagePickerAsset[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Opens the image picker and updates state with selected images
  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 0, // 0 = unlimited
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedAssets(result.assets);
    }
  };

  // Uploads selected images to the backend server
  const uploadImage = async () => {
    setIsLoading(true);
    if (!selectedAssets?.length) return;

    const formData = new FormData();
    for (const asset of selectedAssets) {
      // Append each image file to the form data
      // @ts-expect-error: special react native format for form data
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split("/").pop(),
        type: asset.mimeType,
      });

      // Optionally append EXIF data if present
      if (asset.exif) {
        formData.append("exif", JSON.stringify(asset.exif));
      }
    }

    // Send POST request to backend API
    const res = await fetch(`http://${ipAddress}:3000/api/upload`, {
      method: "POST",
      body: formData,
    });

    // Log raw response for debugging
    const text = await res.text();
    console.log("Raw response text:", text);

    try {
      // Attempt to parse JSON response
      const data = JSON.parse(text);
      console.log("Upload:", data);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    } finally {
      setIsLoading(false);
      // Clear selected assets after upload
      setSelectedAssets(undefined);
    }
  };

  // --- UI Rendering ---

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {
          // If images are selected, show them in a grid
          selectedAssets && selectedAssets.length > 0 ? (
            <FlatList
              data={selectedAssets}
              numColumns={numColumns}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                // Display each selected image in the grid
                <Image source={item} style={styles.listImage} />
              )}
            />
          ) : (
            // Otherwise, show the placeholder image
            <Image source={placeHolderImage} />
          )
        }
      </View>
      {isLoading && <ActivityIndicator size="large" color="#ffffff" />}
      {!isLoading && (
        <View style={styles.footerContainer}>
          {/* Button to open image picker */}
          <Button label="Choose some photos" theme="primary" onPress={pickImageAsync} />
          {/* Show upload button only if images are selected */}
          {selectedAssets?.length &&
            <Button label={`upload ${selectedAssets.length > 1 ? "these photos" : "this photo"} `} onPress={uploadImage} />
          }
        </View>
      )}
    </SafeAreaView>
  );
}

// Styles for layout and appearance
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