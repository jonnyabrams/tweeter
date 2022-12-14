import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Tweet, TweetBody } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";

interface Props {
  session: any;
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

const Tweetbox = ({ session, setTweets }: Props) => {
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageUrlBoxOpen, setImageUrlBoxOpen] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addImageToTweet = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current?.value);
    imageInputRef.current.value = "";
    setImageUrlBoxOpen(false);
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "/image/default.jpeg",
      image: image,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    });

    const json = await result.json();

    // update tweets without using Redux/Context API
    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast("Tweet posted");

    return json;
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    postTweet();

    setInput("");
    setImage("");
    setImageUrlBoxOpen(false);
  };

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
              <PhotographIcon
                onClick={() => setImageUrlBoxOpen(!imageUrlBoxOpen)}
                className={iconStyles}
              />
              <SearchCircleIcon className={iconStyles} />
              <EmojiHappyIcon className={iconStyles} />
              <CalendarIcon className={iconStyles} />
              <LocationMarkerIcon className={iconStyles} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="px-5 py-2 font-bold text-white rounded-full bg-twitter disabled:opacity-40"
            >
              Tweet
            </button>
          </div>

          {imageUrlBoxOpen && (
            <form className="flex px-4 py-2 mt-5 rounded-lg bg-twitter/80">
              <input
                ref={imageInputRef}
                className="flex-1 p-2 text-white bg-transparent outline-none placeholder:text-white"
                type="text"
                placeholder="Enter image URL..."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white"
              >
                Add image
              </button>
            </form>
          )}

          {image && (
            <img
              className="object-contain w-full h-40 mt-10 shadow-lg rounded-xl"
              src={image}
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Tweetbox;
