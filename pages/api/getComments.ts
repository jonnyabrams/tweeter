// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "../../sanity";
import { Comment } from "../../typings";

const commentQuery = groq`
  *[_type == "comment" && references(*[_type == 'tweet' && _id == $tweetId]._id)] {
  _id,
  ...
}
`;

type Data = Comment[];

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { tweetId } = req.query;

  const comments: Comment[] = await sanityClient.fetch(commentQuery, {
    tweetId,
  });

  res.status(200).json(comments);
};

export default handler;