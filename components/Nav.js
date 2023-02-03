import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import Logo from "../Images/blogLogo.png";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  console.log(user);

  return (
    <nav className=" flex justify-between items-center py-10">
      <Link href="/">
        <Image className="  w-36 " src={Logo} alt="/" />
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link
            href={"/auth/login"}
            className="py-2 px-4 text-sm bg-emerald-300 text-white rounded-lg font-medium ml-8"
          >
            Join Now
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href={"/post"}>
              <button className=" font-medium bg-emerald-300 text-white py-2 px-4 rounded-md text-sm hover:bg-teal-500">
                Post
              </button>
            </Link>
            <Link href={"/dashboard"}>
              <img
                className=" w-12 rounded-full cursor-pointer border-2 border-emerald-300  "
                src={user.photoURL}
                alt="/"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
