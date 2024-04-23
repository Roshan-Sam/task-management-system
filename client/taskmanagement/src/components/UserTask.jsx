import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Label, Badge, Textarea, Button, Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import Cookies from "js-cookie";

const UserTask = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [task, setTask] = useState({});
  const [taskId, setTaskId] = useState(null);
  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const idFromUrl = urlParams.get("taskId");
    if (idFromUrl) {
      fetchTask(idFromUrl);
      fetchComments(idFromUrl);
      setTaskId(idFromUrl);
    }
  }, [location.search]);

  const fetchTask = async (taskId) => {
    try {
      const taskResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}user/getsingletask/${taskId}/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      const taskData = taskResponse.data;
      const createdByUserId = taskData.created_by;
      const userResponse = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }user/gettaskcreatedby/${createdByUserId}/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      const createdByUserData = userResponse.data;

      const combinedData = {
        ...taskData,
        created_by: createdByUserData,
      };

      setTask(combinedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") {
      setError("Please enter a comment.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}user/addcomment/`,
        { comment: comment, user: currentUser.id, task: taskId },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        setComment("");
        fetchComments(taskId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}user/getcomments/${taskId}/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      if (res.status === 200) {
        setComments(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}user/deletecomment/${id}/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setSuccess("");
        }, 2000);
        fetchComments(taskId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-3 w-full flex flex-col items-center pt-20">
        {showToast && (
          <Toast className=" absolute top-1 mx-auto bg-white shadow-lg border border-gray-200 p-4 rounded-lg">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{success}</div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        )}
        <h1 className="text-2xl font-semibold mb-6">Task</h1>
        <div className="w-full shadow-sm-light shadow-slate-200 border-1 p-4 flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="title"
              value="Title:"
              className="text-xl font-medium italic"
            />
            <p id="title" className="text-lg font-light">
              {task.title}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Badge color="info" className="w-fit italic text-sm font-semibold">
              Created by:
            </Badge>
            <div className="max-w-[200px] flex justify-between items-center gap-4">
              {task.created_by && (
                <>
                  <p className="font-light text-lg">
                    @{task.created_by.username}
                  </p>
                  <img
                    src={`${import.meta.env.VITE_API_IMAGE_URL}${
                      task.created_by.profile
                    }`}
                    alt={task.id}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Badge color="pink" className="w-fit italic text-sm font-semibold">
              Created at:
            </Badge>
            <p className="text-base font-light">
              {new Date(task.created_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Badge
              color="purple"
              className="w-fit italic text-sm font-semibold"
            >
              Due date:
            </Badge>
            <p className="text-base font-light">
              {new Date(task.due_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Badge
              color="indigo"
              className="w-fit italic text-sm font-semibold"
            >
              Status:
            </Badge>
            <Badge className="w-fit text-sm" color="failure">
              {task.status}
            </Badge>
          </div>
        </div>
        <div className="max-w-2xl mx-auto w-full p-3">
          {currentUser && (
            <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
              <p>Signed in as:</p>
              <img
                src={`${import.meta.env.VITE_API_IMAGE_URL}${
                  currentUser.profile
                }`}
                className="h-6 w-6 object-cover rounded-full"
              />
              <p className="text-xs text-cyan-600 hover:underline">
                @{currentUser.username}
              </p>
            </div>
          )}
          {currentUser && (
            <form
              onSubmit={handleSubmit}
              className="border border-teal-500 rounded-md p-3"
            >
              <Textarea
                placeholder="Add a comment..."
                rows="3"
                maxLength="200"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <div className="flex justify-between items-center mt-5">
                <p className="text-gray-500 text-sm">
                  {200 - comment.length} characters remaining
                </p>
                <Button outline gradientDuoTone="purpleToBlue" type="submit">
                  Submit
                </Button>
              </div>
              {error && (
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                  className="mt-2"
                >
                  <span className="font-medium">Info alert! {error}</span>
                </Alert>
              )}
            </form>
          )}
          {comments.length === 0 ? (
            <p className="text-sm my-5">No comments yet.</p>
          ) : (
            <>
              <div className="text-sm my-5 flex items-center gap-1">
                <p>Comments</p>
                <div className="border border-gray-400 py-1 px-2 rounded-sm">
                  <p>{comments.length}</p>
                </div>
              </div>
              {comments.map((comment) => (
                <div
                  className="flex p-4 border-b dark:border-gray-600 text-sm"
                  key={comment.id}
                >
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                      src={`${import.meta.env.VITE_API_IMAGE_URL}${
                        comment.user.profile
                      }`}
                      alt={comment.user.username}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-bold mr-1 text-xs truncate">
                        {comment.user
                          ? `@${comment.user.username}`
                          : "anonymous user"}
                      </span>
                    </div>
                    <p>{comment.comment}</p>
                    {currentUser && currentUser.id === comment.user.id && (
                      <div className="flex">
                        <button
                          type="button"
                          className="text-red-500 hover:underline ml-auto"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserTask;
