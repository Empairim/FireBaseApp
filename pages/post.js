import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
//build in stuff from firebase
import { toast } from "react-toastify";

export default function Post() {
  //Form state
  const [post, setPost] = useState({ description: "" });

  //user define
  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  const routeData = route.query;

  //Submit Post
  const submitPost = async (e) => {
    e.preventDefault();

    //Run checks for description
    if (!post.description) {
      toast.error("Description Field empty 🤨 ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return;
    }
    //user ffeedback ui to put something in desc
    if (post.description.length > 300) {
      toast.error("Description too long 😅 ", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return;
    }

    //checking if post has id if it does its an update to a post
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      console.log("Post created:", post);
      // for post to work must set up firetore database and change the read write access so it only allows it if user is authenticated it will not redirect even if the post goes through and is on the main page it will ONLY work if it gets feed back that its saved to the database.
      return route.push("/");
    } else {
      //Make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      //clears post after success
      //toast is just user feedback ui
      toast.success("Post has been made 👍", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      console.log("Post created:", post);

      return route.push("/");
    }
  };
  //makes a collection even if^ there isnt any if FirebaseError: Missing or insufficient permissions. check rules tab in firestore database

  //Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className=" my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className=" text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
        </h1>
        <div className=" py-2">
          <h3 className=" text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className=" resize-none bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm "
          ></textarea>
          <p
            className={`text-emerald-300 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className=" w-full bg-emerald-300 text-white font-medium p-2 my-2 rounded-lg text-sm hover:bg-teal-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
