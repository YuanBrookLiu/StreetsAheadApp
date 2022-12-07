import { View, Text,Pressable,StyleSheet,TextInput, Alert } from 'react-native'
import React,{useState,useEffect} from 'react'
import Button from '../../components/Button';
import { useNavigation } from "@react-navigation/native";
import { storage } from "../../firebase/firebase-setup";
import { firestore, auth } from "../../firebase/firebase-setup";
import { writePostToDB } from "../../firebase/firestore";
import Colors from '../../components/Colors';
import * as MediaLibrary from 'expo-media-library'; 
import { ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";

export default function CameraStepPage({route,navigation}) {

  const [mediaUri, setMediaUri] = useState("");
  const [linkedEventId, setLinkedEventId] = useState("");
  const [comment, setComment] = useState("");
  const [mediaType, setMediaType]= useState("");
  useEffect(() => {
    if(route.params.eventId){
      setLinkedEventId(route.params.eventId);
    }
  }, [route.params.eventId]);

  useEffect(() => {
    if(route.params.mediaType){
      setMediaType(route.params.mediaType);
    }
  }, [route.params.mediaType]);
  
  useEffect(() => {
    if(route.params.mediaUri){
      setMediaUri(route.params.mediaUri);
    }
  }, [route.params.mediaUri]);



  const onUpload = async () => {
    if(linkedEventId==""){
      alert("You must link your post to an event");
      return;
    }
    if(comment==""){
      alert("Please give a comment");
      return;
    }
      try{  
        const response = await fetch(mediaUri);
        const blob = await response.blob();
        const name= blob._data.name;
        const imageRef = await ref(storage,`images/${name}` );

        const uploadTask = await uploadBytesResumable(imageRef, blob);
        blob.close();
        const u=await getDownloadURL(imageRef);
        await writePostToDB({
          mediaUri:u,
          postTime:new Date(),
          linkedEventId:linkedEventId,
          comment:comment,
        mediaType:mediaType});
        Alert.alert("Success","You have successfully posted");
        navigation.navigate("Camera");
      }
   catch (err) {
    alert(err)
  }
  };

  const onDownload = async () => {

    try {
      await MediaLibrary.saveToLibraryAsync(mediaUri);
      alert("success")
    } catch (err) {
      alert(err);
    }
  };

  function linkEventPressed() {
    navigation.navigate("FindEventPage");
  }

  return (
    <View>
      
    <Button
      onPress={linkEventPressed}
      title={"Link to an event"}/>

<TextInput
            style={styles.input}
            onChangeText={(newComment) => {
              setComment(newComment);
            }}
            value={comment}
            multiline={true}
            placeholder=" Enter some comment"
          />

<Button
      onPress={onUpload}
      title={"Upload"}
      buttonColor={"blue"}
      />
<Button
      onPress={onDownload}
      title={"Download"}
      buttonColor={"blue"}
      />
</View>


  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.lightPurple,
    height: 30,
    borderRadius: 5,
    marginVertical:10,
    marginHorizontal:20
  },
});