import { Tweet } from "../typings";

interface Props {
  tweet: Tweet;
}

const Tweet = ({ tweet }: Props) => {
  return <div>Tweet</div>;
};

export default Tweet;
