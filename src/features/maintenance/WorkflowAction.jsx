/* eslint-disable react/prop-types */
import styled from "styled-components";

const ActionBox = styled.div`
  background-color: var(--color-grey-50);
  padding: 2rem;
  border-radius: var(--border-radius-md);
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  border: 1px solid var(--color-grey-200);

  ${props => props.variation === 'success' && `
    border-color: var(--color-green-700);
    background-color: var(--color-green-100);
  `}

  ${props => props.variation === 'warning' && `
    border-color: var(--color-yellow-700);
    background-color: var(--color-yellow-100);
  `}
`;

const StepHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-bottom: 1rem;
    color: var(--color-brand-600);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.2rem;
    letter-spacing: 0.5px;

    ${props => props.variation === 'warning' && `color: var(--color-yellow-700);`}
`;

function WorkflowAction({
    title,
    children,
    variation = 'default'
}) {
    return (
        <ActionBox variation={variation}>
            <StepHeader variation={variation}>{title}</StepHeader>
            {children}
        </ActionBox>
    );
}

export default WorkflowAction;
