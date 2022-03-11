import { useState, useContext } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";

const AddComment = ({ docId, comments, setComments, commentInput }) => {
  const [comment, setComment] = useState("");
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const displayName = user?.displayName;

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setComments([...comments, { displayName, comment }]);
    try {
      await firebase
        .firestore()
        .collection("photos")
        .doc(docId)
        .update({
          comments: FieldValue.arrayUnion({ displayName, comment })
        });
      setComment("");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="border-t border-gray">
      <form
        className="flex w-full justify-between pl-0 pr-5"
        onSubmit={handleSubmitComment}
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray w-full mr-3 py-5 px-4"
          type="text"
          name="comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleChange}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-500 ${
            !comment && "opacity-25"
          }`}
          type="submit"
          disabled={comment.length < 3}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddComment;
