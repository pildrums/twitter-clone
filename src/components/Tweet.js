import React, { useState } from 'react';
import { dbService } from 'Instance';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const Tweet = ({ tweetObj, isOwner }) => {
  // edit 상황인지 아닌지 여부
  const [edit, setEdit] = useState(false);
  // input에 입력된 text 업데이트
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const tweetText = doc(dbService, 'tweets', `${tweetObj.id}`);

  const onDelete = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(tweetText);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(tweetObj, newTweet);
    await updateDoc(tweetText, {
      text: newTweet
    });
    setEdit(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };

  const toggleEdit = () => setEdit((prev) => !prev);
  return (
    <div>
      {edit ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDelete}>Delete</button>
              <button onClick={toggleEdit}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
