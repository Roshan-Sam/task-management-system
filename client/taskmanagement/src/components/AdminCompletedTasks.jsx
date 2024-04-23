import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "antd";
import { Badge, Spinner, Table } from "flowbite-react";
import Cookies from "js-cookie";
import { Popover } from "antd";

const AdminCompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState(null);

  const fetchCompletedTasksOfUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}admin/getsubmittedtasks/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setCompletedTasks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompletedTasksOfUsers();
  }, []);

  return (
    <>
      {completedTasks === null ? (
        <div className="loading mx-auto p-40">
          <Spinner aria-label="Extra large spinner example" size="xl" />
        </div>
      ) : completedTasks.length === 0 ? (
        <div className="text-center mx-auto p-20 text-2xl font-semibold">
          No submitted tasks to display.
        </div>
      ) : (
        <div className="overflow-x-auto mx-auto pt-20 w-full px-20 pb-10">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Submitted Tasks
          </h1>
          <Table hoverable className="border border-gray-100 dark:border-none">
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Completed at</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
              <Table.HeadCell>Completed by</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {completedTasks.map((task, index) => (
                <Table.Row
                  key={task.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>{task.title}</Table.Cell>
                  <Table.Cell className="text-center text-md">
                    <Popover
                      content={task.description}
                      arrow={false}
                      overlayStyle={{
                        maxWidth: 400,
                        wordWrap: "break-word",
                      }}
                      placement="bottom"
                    >
                      <p className="text-cyan-600 cursor-pointer">view</p>
                    </Popover>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(task.created_date).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(task.completed_date).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="success" className="w-fit">
                      {task.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1 items-center">
                      <img
                        src={`${import.meta.env.VITE_API_IMAGE_URL}${
                          task.user.profile
                        }`}
                        className="w-10 h-10 object-cover bg-gray-500"
                      />
                      {task.user ? task.user.username : "anonymous user"}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Image
                      width={60}
                      height={60}
                      src={`${import.meta.env.VITE_API_IMAGE_URL}${
                        task.task_image
                      }`}
                      className="object-cover bg-gray-500"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  );
};

export default AdminCompletedTasks;
