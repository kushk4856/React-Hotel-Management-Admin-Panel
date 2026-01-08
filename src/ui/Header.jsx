/* eslint-disable react/prop-types */
import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";
import MenuToggleBtn from "./MenuToggleBtn";

const StyledHeader = styled.header`
  background-color: var(--color-header-bg);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;

  @media only screen and (max-width: 768px) {
    justify-content: space-between;
    padding: 1.2rem;
  }
`;

const Header = ({ handleMenu }) => {
  return (
    <StyledHeader>
      <MenuToggleBtn />
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
};

export default Header;
