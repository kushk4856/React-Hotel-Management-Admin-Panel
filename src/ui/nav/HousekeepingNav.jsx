/* eslint-disable react/prop-types */
import {
  HiOutlineClipboardDocumentList,
  HiOutlineWrenchScrewdriver,
  HiOutlineArchiveBox, // Lost & Found
  HiOutlineChatBubbleLeftRight, // Shift Notes
  HiOutlineUserCircle, // Profile
} from "react-icons/hi2";
import { NavList, StyledNavLink } from "./NavStyles";

function HousekeepingNav({ onCloseModal }) {
  return (
    <NavList>
        <li>
        <StyledNavLink to="/housekeeping" onClick={onCloseModal}>
          <HiOutlineClipboardDocumentList />
          <span>Today</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/my-rooms" onClick={onCloseModal}>
          <HiOutlineClipboardDocumentList />
          <span>My Rooms</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/maintenance" onClick={onCloseModal}>
          <HiOutlineWrenchScrewdriver />
          <span>Maintenance</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/lost-found" onClick={onCloseModal}>
          <HiOutlineArchiveBox />
          <span>Lost & Found</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/shift-notes" onClick={onCloseModal}>
          <HiOutlineChatBubbleLeftRight />
          <span>Shift Notes</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/account" onClick={onCloseModal}>
          <HiOutlineUserCircle />
          <span>Profile</span>
        </StyledNavLink>
      </li>
    </NavList>
  );
}

export default HousekeepingNav;
