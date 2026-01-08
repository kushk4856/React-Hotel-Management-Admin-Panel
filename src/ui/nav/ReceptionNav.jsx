/* eslint-disable react/prop-types */
import {
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { NavList, StyledNavLink } from "./NavStyles";

function ReceptionNav({ onCloseModal }) {
  // Note: Using 'bookings' as the main workspace for now
  return (
    <NavList>
        <li>
        <StyledNavLink to="/bookings" onClick={onCloseModal}>
          <HiOutlineCalendarDays />
          <span>Front Desk</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/guests" onClick={onCloseModal}>
          <HiOutlineUserGroup />
          <span>Guests</span>
        </StyledNavLink>
      </li>
      {/* 
        TODO: Add future links
        - /arrivals
        - /departures
        - /check-in
      */}
    </NavList>
  );
}

export default ReceptionNav;
