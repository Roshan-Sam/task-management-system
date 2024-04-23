import Header from "../components/Header";
import AdminDashSideBar from "../components/AdminDashSideBar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminProfile from "../components/AdminProfile";
import AdminAddTask from "../components/AdminAddTask";
import AdminTasks from "../components/AdminTasks";
import EditTask from "../components/EditTask";
import AdminCompletedTasks from "../components/AdminCompletedTasks";
import AdminTask from "../components/AdminTask";

const AdminDashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState();
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:flex-row relative">
        <div className="md:w-64">
          <AdminDashSideBar />
        </div>

        {tab === "tasks" && urlParams.size > 0 && <AdminTasks />}

        {tab === "profile" && urlParams.size > 0 && <AdminProfile />}

        {tab === "addtask" && urlParams.size > 0 && <AdminAddTask />}

        {tab === "edittask" && urlParams.size > 0 && <EditTask />}

        {tab === "userstasks" && urlParams.size > 0 && <AdminCompletedTasks />}

        {tab === "task" && urlParams.size > 0 && <AdminTask />}
      </div>
    </>
  );
};

export default AdminDashboard;
