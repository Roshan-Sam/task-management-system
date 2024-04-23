import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Badge, Spinner } from "flowbite-react";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminTasks = () => {
  const [tasks, setTasks] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});
  const navigate = useNavigate();

  const getTasks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}admin/gettasks/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setTasks(res.data);
      }
    } catch (error) {
      console.log(error.data.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleDeleteTask = async () => {
    setOpenModal(false);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}admin/deletetask/${taskIdToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res.status === 200) {
        getTasks();
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAssignedUsers = async (taskId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}admin/getassignedusers/${taskId}/`,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
        }
      );
      if (res.status === 200) {
        setAssignedUsers({ ...assignedUsers, [taskId]: res.data });
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
            Tasks added
          </h1>
          <Table hoverable className="border border-gray-100 dark:border-none">
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Due date</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
              <Table.HeadCell>Assigned users</Table.HeadCell>
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
                      navigate(`/admindashboard?tab=task&taskId=${task.id}`)
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
                    {task.status === "Completed" ? (
                      <Badge color="success" className="w-fit">
                        {task.status}
                      </Badge>
                    ) : (
                      <Badge color="failure" className="w-fit">
                        {task.status}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="cursor-pointer w-fit flex">
                    <Dropdown
                      menu={{
                        items: assignedUsers[task.id]
                          ? assignedUsers[task.id].map((user) => ({
                              label: user.username,
                              key: user.id,
                            }))
                          : [],
                      }}
                      overlayClassName="custom-dropdown"
                      onOpenChange={(visible) => {
                        if (visible && !assignedUsers[task.id]) {
                          getAssignedUsers(task.id);
                        }
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Badge className="w-fit rounded-xl" color="purple">
                          {task.assigned_to.length}
                        </Badge>
                      </a>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-8 w-fit">
                      <Link
                        to={"/admindashboard?tab=edittask&tid=" + task.id}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      >
                        Edit
                      </Link>
                      <a
                        className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer"
                        onClick={() => {
                          setOpenModal(true);
                          setTaskIdToDelete(task.id);
                        }}
                      >
                        Delete
                      </a>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this task?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteTask}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default AdminTasks;
