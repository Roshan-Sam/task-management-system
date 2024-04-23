import Header from "../components/Header";
import DashSideBar from "../components/DashSideBar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import UserTasks from "../components/UserTasks";
import UserProfile from "../components/UserProfile";
import UserCompletedTasks from "../components/UserCompletedTasks";
import UserTask from "../components/UserTask";

const UserDashboard = () => {
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
          <DashSideBar />
        </div>

        {tab === "tasks" && urlParams.size > 0 && <UserTasks />}

        {tab === "profile" && urlParams.size > 0 && <UserProfile />}

        {tab === "completedtasks" && urlParams.size > 0 && (
          <UserCompletedTasks />
        )}

        {tab === "task" && urlParams.size > 0 && <UserTask />}
      </div>
    </>
  );
};

export default UserDashboard;
