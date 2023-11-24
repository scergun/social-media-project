import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Post } from "../../components/Post";

export const Home = () => {
  const [postsList, setPostsList] = useState(null);
  const postsRef = collection(db, "posts");

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div>
      {postsList?.map((post, key) => (
        <Post post={post} key={key} />
      ))}
    </div>
  );
};
