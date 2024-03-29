import Employees from "../pages/Employees";
import Workers from "../pages/Workers";
import Pilots from "../pages/Pilots";
import Owners from "../pages/Owners";
import Services from "../pages/Services";
import Drones from "../pages/Drones";
import Locations from "../pages/Locations";
import Restaurants from "../pages/Restaurants";
import Ingredients from "../pages/Ingredients";
import Home from "../pages/Home";
import WorkFor from "../pages/WorkFor";

function getRoute(label, url, page) {
  return { label, url, page };
}

const routes = [
  getRoute('Home', '/', <Home />),
  getRoute('Users', '/u'),
  getRoute('Employees', '/u/employees', <Employees />),
  getRoute('Workers', '/u/workers', <Workers />),
  getRoute('Pilots', '/u/pilots', <Pilots />),
  getRoute('Owners', '/u/owners', <Owners />),
  getRoute('WorkFor', '/u/work_for', <WorkFor />),
  getRoute('Services', '/services',  <Services />),
  getRoute('Drones', '/drones',  <Drones />),
  getRoute('Locations', '/locations',  <Locations />),
  getRoute('Restaurants', '/restaurants',  <Restaurants />),
  getRoute('Ingredients', '/ingredients',  <Ingredients />),
];

export default routes;