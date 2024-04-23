import { Avatar, Dropdown, Navbar, Button } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className="relative">
      <Navbar rounded className="border-b-4">
        <Navbar.Brand href="/home">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Task Management
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2 gap-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt={currentUser.username}
                img={`${import.meta.env.VITE_API_IMAGE_URL}${
                  currentUser.profile
                }`}
                rounded
                className="object-cover"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>
              {currentUser.admin ? (
                <Link to={"/admindashboard?tab=profile"}>Profile</Link>
              ) : (
                <Link to={"/userdashboard?tab=profile"}>Profile</Link>
              )}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="cursor-pointer">
          {currentUser.admin ? (
            <Navbar.Link active={path === "/admindashboard"} as={"div"}>
              <Link to="/admindashboard?tab=profile">Dashboard</Link>
            </Navbar.Link>
          ) : (
            <Navbar.Link active={path === "/userdashboard"} as={"div"}>
              <Link to="/userdashboard?tab=tasks">Dashboard</Link>
            </Navbar.Link>
          )}
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
