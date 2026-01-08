/* eslint-disable react/prop-types */
import {
  HiOutlineClipboardDocumentList,
  HiOutlineWrenchScrewdriver,
  HiOutlineChatBubbleLeftRight, // Shift Notes
  HiOutlineUserCircle, // Profile
  HiOutlineCircleStack, // Audit Logs
} from "react-icons/hi2";
import { NavList, StyledNavLink } from "./NavStyles";
import { useUser } from "../../features/authentication/useUser";
import { PERMISSIONS } from "../../utils/constants";

function HousekeepingNav({ onCloseModal }) {
  const { permissions } = useUser();
  const hasAuditPermission = permissions?.includes(PERMISSIONS.AUDIT_READ);

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

      {hasAuditPermission && (
          <li>
            <StyledNavLink to="/audit-logs" onClick={onCloseModal}>
              <HiOutlineCircleStack />
              <span>Audit Logs</span>
            </StyledNavLink>
          </li>
      )}

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
