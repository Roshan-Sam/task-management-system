import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Textarea,
  Label,
  FileInput,
  Badge,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import Cookies from "js-cookie";

const UserTasks = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({
    user: currentUser.id,
    task: null,
    description: "",
    image: null,
    createdDate: null,
    completedDate: null,
    title: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserTasks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}user/tasks/${currentUser.id}/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      if (res.status === 200) {
        setTasks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, [currentUser.id]);

  const handleSubmit = async () => {
    if (completedTasks.description === "" || completedTasks.image === null) {
      setError("Please provide a description and an image.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}user/completed/`,
        completedTasks,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res.status === 200) {
        fetchUserTasks();
        setError(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {tasks === null ? (
        <div className="loading mx-auto p-40">
          <Spinner aria-label="Extra large spinner example" size="xl" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center mx-auto p-20 text-2xl font-semibold">
          No tasks to display.
        </div>
      ) : (
        <div className="overflow-x-auto mx-auto pt-20 w-full px-20">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Tasks to complete
          </h1>
          <Table hoverable className="border border-gray-100 dark:border-none">
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Due date</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
              <Table.HeadCell>
                <span className="">Action</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {tasks.map((task, index) => (
                <Table.Row
                  key={task.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/userdashboard?tab=task&taskId=${task.id}`)
                    }
                  >
                    {task.title}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(task.created_date).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(task.due_date).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="failure" className="w-fit">
                      Pending
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-red-500 cursor-pointer"
                      onClick={() => {
                        setOpenModal(true);
                        setCompletedTasks((prev) => ({
                          ...prev,
                          task: task.id,
                          createdDate: task.created_date,
                          title: task.title,
                          completedDate: new Date().toISOString(),
                        }));
                      }}
                    >
                      Submit
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Submit a task</Modal.Header>
            <Modal.Body className="flex flex-col gap-2">
              <>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="description">Add description</Label>
                  <Textarea
                    type="text"
                    placeholder="Enter description"
                    id="description"
                    name="description"
                    onChange={(e) =>
                      setCompletedTasks((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="file" value="Upload Image" />
                  <FileInput
                    id="file"
                    helperText="A a screenshot of the task you have completed."
                    accept="image/*"
                    onChange={(e) =>
                      setCompletedTasks((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                      }))
                    }
                    required
                  />
                </div>
                {error && (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium">Info alert! {error}</span>
                  </Alert>
                )}
              </>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleSubmit}>Submit</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default UserTasks;
