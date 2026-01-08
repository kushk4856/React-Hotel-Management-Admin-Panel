/* eslint-disable react/prop-types */
import styled, { css } from "styled-components";

const NavContainer = styled.div`
  display: flex;
  gap: 1.2rem;
  background-color: var(--color-grey-0);
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
  transition: all 0.3s;

  &:hover {
    background-color: var(--color-grey-50);
    color: var(--color-brand-600);
  }

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);

      &:hover {
        background-color: var(--color-brand-700);
        color: var(--color-brand-50);
      }
    `}
`;

export default function ReportsNavigation({ activeTab, setActiveTab }) {
  return (
    <NavContainer>
       <NavButton $active={activeTab === 'business'} onClick={() => setActiveTab('business')}>Business & Revenue</NavButton>
       <NavButton $active={activeTab === 'operations'} onClick={() => setActiveTab('operations')}>Operations</NavButton>
    </NavContainer>
  )
}
