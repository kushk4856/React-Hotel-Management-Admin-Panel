/* eslint-disable react/prop-types */
import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineHomeModern,
  HiOutlineClipboardDocumentList,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog6Tooth,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineDocumentText, // Audit
} from "react-icons/hi2";
import { NavList, StyledNavLink } from "./NavStyles";
import styled from "styled-components";

const SectionTitle = styled.div`
    font-size: 1.1rem;
    text-transform: uppercase;
    color: var(--color-grey-500);
    font-weight: 600;
    margin: 1.6rem 0 0.8rem 2.4rem;
    letter-spacing: 0.5px;
`;

function AdminNav({ onCloseModal }) {
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
      <li>
        <StyledNavLink to="/cabins" onClick={onCloseModal}>
          <HiOutlineHomeModern />
          <span>Cabins</span>
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
        <StyledNavLink to="/shift-notes" onClick={onCloseModal}>
          <HiOutlineChatBubbleLeftRight />
          <span>Shift Notes</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/reports" onClick={onCloseModal}>
          <HiOutlineChartBar />
          <span>Reports</span>
        </StyledNavLink>
      </li>

      <SectionTitle>Administration</SectionTitle>

      <li>
        <StyledNavLink to="/users" onClick={onCloseModal}>
          <HiOutlineUsers />
          <span>Staff & Users</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/roles" onClick={onCloseModal}>
          <HiOutlineShieldCheck />
          <span>Roles & Permissions</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/audit-logs" onClick={onCloseModal}>
          <HiOutlineDocumentText />
          <span>Audit Logs</span>
        </StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/settings" onClick={onCloseModal}>
          <HiOutlineCog6Tooth />
          <span>System Settings</span>
        </StyledNavLink>
      </li>
    </NavList>
  );
}

export default AdminNav;
