/* eslint-disable react/prop-types */
import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import Uploader from "../data/Uploader";

const StyledSidebar = styled.aside`
  background-color: var(--color-sidebar-bg);
  color: var(--color-sidebar-text);
  padding: 3.2rem 2.4rem;
  padding-right: 0;
  border-right: 1px solid var(--color-border);
  grid-row: 1/-1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const NavWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 10px;
    
    &:hover {
      background: var(--color-brand-600);
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: var(--color-grey-300) var(--color-grey-100);
`;

const Sidebar = ({ menu }) => {
  return (
    <StyledSidebar>
      <Logo />
      <NavWrapper>
        <MainNav />
      </NavWrapper>
      {/* <Uploader /> */}
    </StyledSidebar>
  );
};

export default Sidebar;
