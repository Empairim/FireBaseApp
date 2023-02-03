export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <img
          src={avatar}
          className=" w-10 rounded-full border-2 border-emerald-300"
        />
        <h2>{username}</h2>
      </div>
      <div className=" py-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
