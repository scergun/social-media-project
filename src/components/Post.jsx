import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Post.css";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export const Post = (props) => {
  const { post } = props;
  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState(null);
  const navigate = useNavigate();

  const likesRef = collection(db, "likes");
  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };
  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const addlike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removelike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user.uid)
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.LikeId === likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div>
      <div className="post1">
        <div className="user-info-container1">
          <div className="user-info1">
            <img
              src={post.userImg}
              width={90}
              height={90}
              style={{ borderRadius: "90px" }}
              onClick={() => {
                navigate("/user");
                setClickedProfile(post.userId);
              }}
            />
            <p
              className="username1"
              onClick={() => {
                navigate("/user");
                setClickedProfile(post.userId);
              }}
            >
              {post.username}
            </p>
          </div>
        </div>
        <div className="title1">
          <h1>{post.title}</h1>
        </div>
        <div className="body1">
          <p>{post.description} </p>
        </div>
        <div className="footer1">
          <button onClick={hasUserLiked ? removelike : addlike}>
            {hasUserLiked ? <HeartFill size={18} /> : <Heart size={18} />}
          </button>
          {likes && <p>{likes?.length}</p>}
        </div>
      </div>
    </div>
  );
};
