/* eslint-disable react/prop-types */
import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineHomeModern,
  HiOutlineClipboardDocumentList,
  HiOutlineWrenchScrewdriver, // Maintenance
  HiOutlineBanknotes, // Rates
  HiOutlineChartBar, // Reports
  HiOutlineHeart, // Service Recovery
  HiOutlineUserCircle // Profile
} from "react-icons/hi2";
import { NavList, StyledNavLink } from "./NavStyles";

function ManagerNav({ onCloseModal }) {
  return (
    <NavList>
      <li>
        <StyledNavLink to="/dashboard" onClick={onCloseModal}>
          <HiOutlineHome />
          <span>Dashboard</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/bookings" onClick={onCloseModal}>
          <HiOutlineCalendarDays />
          <span>Bookings</span>
        </StyledNavLink>
      </li>
      {/* Room Allocation = Cabins Management for now */}
      <li>
        <StyledNavLink to="/cabins" onClick={onCloseModal}>
          <HiOutlineHomeModern />
          <span>Room Allocation</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/housekeeping" onClick={onCloseModal}>
          <HiOutlineClipboardDocumentList />
          <span>Housekeeping</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/maintenance" onClick={onCloseModal}>
          <HiOutlineWrenchScrewdriver />
          <span>Maintenance</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/rates" onClick={onCloseModal}>
          <HiOutlineBanknotes />
          <span>Rates & Discounts</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/reports" onClick={onCloseModal}>
          <HiOutlineChartBar />
          <span>Reports</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/service-recovery" onClick={onCloseModal}>
          <HiOutlineHeart />
          <span>Service Recovery</span>
        </StyledNavLink>
      </li>
    </NavList>
  );
}

export default ManagerNav;
