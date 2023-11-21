//The file is named [slug].js because it's a dynamic route in Next.js. In Next.js, square brackets [] are used to create dynamic routes. The [slug] part means that this page can be accessed with different slugs (values). For example, if you have a post with an ID of "abc123," you can access it by going to /abc123.

// The use of dynamic routes allows you to create pages that can handle varying data based on the URL. In this case, it seems like the [slug].js file is used for displaying details and comments for a specific post, and the slug represents the unique identifier (ID) of the post.

//This file is dynamic because it allows user to leave comments on post so that could be anything really soo the slug url is constantly changing and new.

import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  // Access the Next.js router
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessages] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    // Check if the user is logged in
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      // Display an error if the message is empty
      toast.error("Don't leave an empty message 😠", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    // Reference to the post document
    const docRef = doc(db, "posts", routeData.id);
    // Update the document with the new comment
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    // Clear the message input
    setMessage("");
  };

  // Get comments for the post
  const getComments = async () => {
    // Reference to the post document
    const docRef = doc(db, "posts", routeData.id);
    // Set up a snapshot listener to get real-time updates on comments
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      // Update the state with the latest comments
      setAllMessages(snapshot.data()?.comments || []);
    });
    return unsubscribe;
  };

  // Fetch comments when the component is ready
  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      {/* Display the main post using the Message component */}
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          {/* Input field for new messages */}
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Send a message? 🤔"
            className="bg-gray-800 w-full p-2 text-white text-sm "
          />
          {/* Button to submit the message */}
          <button
            onClick={submitMessage}
            className=" bg-emerald-300 text-white font-medium p-2 mx text-sm hover:bg-teal-500"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {/* Display comments */}
          {allMessage?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap2 mb-4">
                <img
                  className="w-10 border-2 border-emerald-300 rounded-full"
                  src={message.avatar}
                  alt=""
                />
                <h2>{message.userName}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
