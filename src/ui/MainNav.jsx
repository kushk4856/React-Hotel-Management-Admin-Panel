/* eslint-disable react/prop-types */
import { useUser } from "../features/authentication/useUser";
import { ROLES } from "../../utils/constants";

import ManagerNav from "./nav/ManagerNav";
import HousekeepingNav from "./nav/HousekeepingNav";
import ReceptionNav from "./nav/ReceptionNav";
import AdminNav from "./nav/AdminNav";

function MainNav({ onCloseModal }) {
  const { role } = useUser();

  // 🏗️ Strategy Pattern for Role-Based Navigation
  // This allows easy extension for new roles (e.g., "maintenance")
  const NavStrategies = {
    [ROLES.ADMIN]: AdminNav,
    [ROLES.MANAGER]: ManagerNav,
    [ROLES.RECEPTIONIST]: ReceptionNav,
    [ROLES.HOUSEKEEPING]: HousekeepingNav,
  };

  // Default to Housekeeping (Least Privilege) if role is unknown
  const CurrentNav = NavStrategies[role] || HousekeepingNav;

  return (
    <nav>
      <CurrentNav onCloseModal={onCloseModal} />
    </nav>
  );
}

export default MainNav;
