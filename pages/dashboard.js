import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import Message from "@/components/message";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [post, setPosts] = useState([]);

  //See if user in logged in

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //Delete Post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  //Get users data
  useEffect(() => {
    getData();
  }, [user, loading]); //when it should excecute

  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {post.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4">
                <button
                  onClick={() => deletePost(post.id)}
                  className=" text-red-600 flex items-center justify-center gap-2 py-2 text-sm"
                >
                  <FaTrashRestoreAlt className="text-2xl" />
                  Delete
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className=" text-emerald-300 flex items-center justify-center gap-2 py-2 text-sm ">
                    <FaEdit className=" text-2xl" />
                    Edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className=" font-medium text-white bg-gray-800 py-2 px4 rounded-lg my-6 p-3"
        onClick={() => auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
