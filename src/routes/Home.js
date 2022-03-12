import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';
import { dbService, storageService } from 'Instance';
import Tweet from 'components/Tweet';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attach, setAttach] = useState();

  
  useEffect(() => {
    onSnapshot(collection(dbService, 'tweets'), (snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
    const response = await uploadString(fileRef, attach, "data_url");
    console.log(response);
    // await addDoc(collection(dbService, 'tweets'), {
    //   text: tweet,
    //   createdAt: serverTimestamp(),
    //   creatorId: userObj.uid,
    // });
    // setTweet('');
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finished) => {
      const {
        currentTarget: { result },
      } = finished;
      setAttach(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClear = () => {
    setAttach(null);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What`s on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attach && (
          <div>
            <img src={attach} width="50px" height="50px" alt="" />
            <button onClick={onClear}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((item) => (
          <Tweet
            key={item.id}
            tweetObj={item}
            isOwner={item.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
