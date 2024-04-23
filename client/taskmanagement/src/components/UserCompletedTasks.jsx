import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "flowbite-react";
import { Image } from "antd";
import { Badge, Spinner } from "flowbite-react";
import Cookies from "js-cookie";

const UserCompletedTasks = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [completedTasks, setCompletedTasks] = useState(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}user/getcompletedtasks/${
            currentUser.id
          }/`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        if (res.status === 200) {
          setCompletedTasks(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompletedTasks();
  }, []);

  return (
    <>
      {completedTasks === null ? (
        <div className="loading mx-auto p-40">
          <Spinner aria-label="Extra large spinner example" size="xl" />
        </div>
      ) : completedTasks.length === 0 ? (
        <div className="text-center mx-auto p-20 text-2xl font-semibold">
          No completed tasks to display.
        </div>
      ) : (
        <div className="overflow-x-auto mx-auto pt-20 w-full px-20">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Completed Tasks
          </h1>
          <Table hoverable className="border border-gray-100 dark:border-none">
            <Table.Head>
              <Table.HeadCell>No</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Completed at</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
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
                    <Image
                      width={60}
                      height={60}
                      src={`${import.meta.env.VITE_API_IMAGE_URL}${
                        task.task_image
                      }`}
                      style={{ objectFit: "cover" }}
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

export default UserCompletedTasks;
