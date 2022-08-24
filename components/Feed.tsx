import { RefreshIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Tweet } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import TweetComponent from "./Tweet"; // to avoid name clash
import Tweetbox from "./Tweetbox";

interface Props {
  tweets: Tweet[];
}

const Feed = ({ tweets: tweetsProp }: Props) => {
  // allows us to refresh the tweets (renaming tweets prop as tweetsProp)
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);
  const { data: session } = useSession();

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");

    const tweets = await fetchTweets();
    setTweets(tweets);

    toast.success('Feed updated', {
      id: refreshToast
    }) // passing id makes it replace first toast
  };

  return (
    <div className="max-h-screen col-span-7 overflow-scroll lg:col-span-5 border-x">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <RefreshIcon
          onClick={handleRefresh}
          className="w-8 h-8 mt-5 mr-5 transition-all duration-500 ease-out cursor-pointer text-twitter hover:rotate-180 active:scale-125"
        />
      </div>

      <div>
        <Tweetbox session={session} setTweets={setTweets} />
      </div>
 
      <div>
        {tweets.map((tweet) => (
          <TweetComponent key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
