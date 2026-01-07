/* eslint-disable react/prop-types */
import { useUser } from "../features/authentication/useUser";

import ManagerNav from "./nav/ManagerNav";
import HousekeepingNav from "./nav/HousekeepingNav";
import ReceptionNav from "./nav/ReceptionNav";

function MainNav({ onCloseModal }) {
  const { role } = useUser();

  // 🏗️ Strategy Pattern for Role-Based Navigation
  // This allows easy extension for new roles (e.g., "maintenance")
  const NavStrategies = {
    admin: ManagerNav,
    manager: ManagerNav,
    receptionist: ReceptionNav,
    housekeeping: HousekeepingNav,
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
