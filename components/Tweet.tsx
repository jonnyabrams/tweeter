import TimeAgo from "react-timeago";
import React, { useEffect, useState } from "react";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import toast from "react-hot-toast";

import { Comment, CommentBody, Tweet } from "../typings";
import { fetchComments } from "../utils/fetchComments";
import { useSession } from "next-auth/react";

interface Props {
  tweet: Tweet;
}

const Tweet = ({ tweet }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };

  useEffect(() => {
    refreshComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting comment...");

    const comment: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "/image/default.jpeg",
    };

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(comment),
      method: "POST",
    });

    toast.success("Comment posted", {
      id: commentToast,
    });

    setInput("");
    setCommentBoxVisible(false);
    refreshComments();
  };

  const tweetIconStyles =
    "flex cursor-pointer items-center space-x-3 text-gray-400";

  return (
    <div className="flex flex-col p-5 space-x-3 border-gray-100 border-y">
      <div className="flex space-x-3">
        <img
          className="object-cover w-10 h-10 rounded-full"
          src={tweet.profileImg}
          alt=""
        />

        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, "").toLocaleLowerCase()} ??
            </p>

            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet._createdAt}
            />
          </div>

          <p className="pt-1">{tweet.text}</p>

          {tweet.image && (
            <img
              src={tweet.image}
              alt=""
              className="object-cover m-5 mb-1 ml-0 rounded-lg shadow-sm max-h-60"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between mt-5">
        <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className={tweetIconStyles}
        >
          <ChatAlt2Icon className="w-5 h-5" />
          <p>{comments.length}</p>
        </div>

        <div className={tweetIconStyles}>
          <SwitchHorizontalIcon className="w-5 h-5" />
        </div>

        <div className={tweetIconStyles}>
          <HeartIcon className="w-5 h-5" />
        </div>

        <div className={tweetIconStyles}>
          <UploadIcon className="w-5 h-5" />
        </div>
      </div>

      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="flex mt-3 space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 bg-gray-100 rounded-lg outline-none"
            type="text"
            placeholder="Write a comment..."
          />
          <button
            disabled={!input}
            type="submit"
            className="text-twitter disabled:text-gray-200"
          >
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className="p-5 my-2 mt-5 space-y-5 overflow-y-scroll border-t border-gray-100 max-h-44">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute h-8 left-5 top-10 border-x border-twitter-30" />
              <img
                src={comment.profileImg}
                className="object-cover mt-2 rounded-full h-7 w-7"
                alt=""
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, "").toLocaleLowerCase()}{" "}
                    ??
                  </p>

                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={comment._createdAt}
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tweet;
