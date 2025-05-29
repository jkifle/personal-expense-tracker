import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
        ></input>
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
        ></input>
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        ></input>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
          Update
        </button>
      </form>
      <div className="flex flex-row justify-center gap-4 my-2">
        <span className="rounded-lg bg-slate-600 text-white cursor-pointer p-2">
          Sign Out
        </span>
        <span className="text-red-300 rounded-lg bg-slate-600 cursor-pointer p-2">
          Delete account
        </span>
      </div>
    </div>
  );
};

export default Profile;
