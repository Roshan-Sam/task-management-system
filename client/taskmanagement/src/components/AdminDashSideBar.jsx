import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { MdOutlineAddTask } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { GrTask } from "react-icons/gr";

const AdminDashSideBar = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [tab, setTab] = useState();
  const urlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.size === 0) {
      setTab("");
      return;
    }
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    navigate("/login");
  };
  return (
    <Sidebar className="w-full md:w-64 border border-gray-100 dark:border-none">
      <Sidebar.Items className="pt-2">
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to={"/admindashboard?tab=profile"} className="text-gray">
            <Sidebar.Item
              icon={HiUser}
              label="Admin"
              labelColor="dark"
              active={tab === "profile"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to={"/admindashboard?tab=tasks"} className="text-gray">
            <Sidebar.Item
              icon={GoTasklist}
              labelColor="dark"
              active={tab === "tasks"}
              as="div"
            >
              Tasks
            </Sidebar.Item>
          </Link>
          <Link to={"/admindashboard?tab=addtask"} className="text-gray">
            <Sidebar.Item
              icon={MdOutlineAddTask}
              labelColor="dark"
              active={tab === "addtask"}
              as="div"
            >
              Add Tasks
            </Sidebar.Item>
          </Link>
          <Link to={"/admindashboard?tab=userstasks"} className="text-gray">
            <Sidebar.Item
              icon={GrTask}
              labelColor="dark"
              active={tab === "userstasks"}
              as="div"
            >
              Submitted Tasks
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
            as="div"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminDashSideBar;
