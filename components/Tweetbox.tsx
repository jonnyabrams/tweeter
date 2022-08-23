import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Props {
  session: any;
}

const Tweetbox = ({ session }: Props) => {
  const [input, setInput] = useState<string>("");

  const iconStyles =
    "w-5 h-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150";

  return (
    <div className="flex p-5 space-x-2">
      <img
        className="object-cover mt-4 rounded-full h-14 w-14"
        src={session?.user?.image || "/image/default.jpeg"}
        alt="Profile picture"
      />

      <div className="flex items-center flex-1 pl-2">
        <form className="flex flex-col flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="What's happening?"
            className="w-full h-24 text-xl outline-none placeholder:text-xl"
          />
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotographIcon className={iconStyles} />
              <SearchCircleIcon className={iconStyles} />
              <EmojiHappyIcon className={iconStyles} />
              <CalendarIcon className={iconStyles} />
              <LocationMarkerIcon className={iconStyles} />
            </div>

            <button
              disabled={!input}
              className="px-5 py-2 font-bold text-white rounded-full bg-twitter disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tweetbox;
