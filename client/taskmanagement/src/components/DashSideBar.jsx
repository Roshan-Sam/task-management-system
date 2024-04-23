import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoTasklist } from "react-icons/go";
import { MdOutlineTaskAlt } from "react-icons/md";

const DashSideBar = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [tab, setTab] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
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
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/userdashboard?tab=profile"} className="text-gray">
            <Sidebar.Item
              icon={HiUser}
              label="User"
              labelColor="dark"
              as="div"
              active={tab === "profile"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to={"/userdashboard?tab=tasks"} className="text-gray">
            <Sidebar.Item
              icon={GoTasklist}
              labelColor="dark"
              as="div"
              active={tab === "tasks"}
            >
              Tasks
            </Sidebar.Item>
          </Link>
          <Link to={"/userdashboard?tab=completedtasks"} className="text-gray">
            <Sidebar.Item
              icon={MdOutlineTaskAlt}
              labelColor="dark"
              as="div"
              active={tab === "completedtasks"}
            >
              Completed Tasks
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

export default DashSideBar;
