import styled from "styled-components";
import { HiExclamationTriangle, HiWrench, HiClipboardDocumentList } from "react-icons/hi2";
import { useMaintenanceTickets } from "../maintenance/useMaintenanceTickets";
import { useHousekeepingTasks } from "./useHousekeepingTasks";

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.6rem;
  background-color: ${props => {
    switch(props.type) {
      case 'maintenance': return 'var(--color-orange-100)';
      case 'inspection': return 'var(--color-blue-100)';
      case 'stock': return 'var(--color-yellow-100)';
      default: return 'var(--color-grey-50)';
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.type) {
      case 'maintenance': return 'var(--color-orange-600)';
      case 'inspection': return 'var(--color-blue-600)';
      case 'stock': return 'var(--color-yellow-600)';
      default: return 'var(--color-grey-600)';
    }
  }};
  border-radius: var(--border-radius-md);
  transition: all 0.2s;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-grey-0);
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => {
      switch(props.type) {
        case 'maintenance': return 'var(--color-orange-600)';
        case 'inspection': return 'var(--color-blue-600)';
        case 'stock': return 'var(--color-yellow-600)';
        default: return 'var(--color-grey-600)';
      }
    }};
  }
`;

const AlertText = styled.div`
  flex: 1;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  font-weight: 500;
`;

const StatusBadge = styled.span`
  margin-left: 1rem;
  padding: 0.4rem 0.8rem;
  background-color: var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.1rem;
  color: var(--color-grey-700);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-grey-400);
  font-size: 1.6rem;
`;

function AlertsPanel() {
  const { tickets } = useMaintenanceTickets();
  const { tasks } = useHousekeepingTasks();

  // Get active maintenance issues
  const activeIssues = tickets?.filter(t => t.status !== 'resolved' && t.status !== 'closed') || [];
  
  // Get rooms needing inspection
  const needsInspection = tasks?.filter(t => t.status === 'done') || [];

  const allAlerts = [
    ...activeIssues.slice(0, 3).map(issue => ({
      type: 'maintenance',
      text: `Room ${issue.cabin_id} - ${issue.description.split('\n')[0]}`,
      status: issue.status
    })),
    ...needsInspection.slice(0, 3).map(task => ({
      type: 'inspection',
      text: `Room ${task.cabin_id} needs re-inspection`,
      status: 'pending'
    }))
  ];

  return (
    <AlertsList>
      {allAlerts.length === 0 ? (
        <EmptyState>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>✅</div>
          <div>No alerts. Everything is running smoothly!</div>
        </EmptyState>
      ) : (
        allAlerts.map((alert, index) => (
          <AlertItem key={index} type={alert.type}>
            <AlertIcon type={alert.type}>
              {alert.type === 'maintenance' && <HiWrench />}
              {alert.type === 'inspection' && <HiClipboardDocumentList />}
              {alert.type === 'stock' && <HiExclamationTriangle />}
            </AlertIcon>
            <AlertText>
              {alert.text}
              {alert.status && <StatusBadge>{alert.status}</StatusBadge>}
            </AlertText>
          </AlertItem>
        ))
      )}
    </AlertsList>
  );
}

export default AlertsPanel;
