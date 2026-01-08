/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { useHousekeepingTasks } from "../housekeeping/useHousekeepingTasks";
import { useMaintenanceTickets } from "../maintenance/useMaintenanceTickets";
import Spinner from "../../ui/Spinner";
import Stat from "../dashboard/Stat";
import { HiOutlineClipboardDocumentCheck, HiOutlineClock, HiOutlineExclamationTriangle, HiOutlineSparkles, HiOutlineArrowDownTray } from "react-icons/hi2";
import Button from "../../ui/Button";
import { exportToCSV } from "../../utils/helpers";
import Row from "../../ui/Row";

const StyledReport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.4rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default function OperationsReport() {
    const { tasks, isLoading: isLoadingTasks } = useHousekeepingTasks();
    const { tickets, isLoading: isLoadingTickets } = useMaintenanceTickets();

    if (isLoadingTasks || isLoadingTickets) return <Spinner />;

    const handleExport = () => {
         const exportData = tasks?.map(t => ({
             ID: t.id,
             Task: t.title,
             Status: t.status,
             AssignedTo: t.assigned_to,
             StartedAt: t.started_at,
             CompletedAt: t.completed_at
         })) || [];
         exportToCSV(exportData, 'operations_report_tasks');
    };

    // Housekeeping KPIs
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'done' || t.status === 'verified').length || 0;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Avg Cleaning Time (in minutes)
    // Only count tasks that have both started_at and completed_at
    const timedTasks = tasks?.filter(t => t.started_at && t.completed_at) || [];
    const totalMinutes = timedTasks.reduce((acc, t) => {
        const start = new Date(t.started_at);
        const end = new Date(t.completed_at);
        return acc + (end - start) / (1000 * 60);
    }, 0);
    const avgCleaningTime = timedTasks.length ? Math.round(totalMinutes / timedTasks.length) : 0;

    // Maintenance KPIs
    const openTickets = tickets?.filter(t => t.status !== 'resolved').length || 0;
    const highPriorityTickets = tickets?.filter(t => (t.status === 'open' || t.status === 'in_progress') && t.priority === 'high').length || 0;

    return (
        <StyledReport>
             <div style={{display:'flex', justifyContent:'flex-end'}}>
                <Button size="small" onClick={handleExport} variation="secondary">
                    <div style={{display:'flex', alignItems:'center', gap: '0.5rem'}}>
                        <HiOutlineArrowDownTray /> <span>Export Data</span>
                    </div>
                </Button>
             </div>
            <StatsGrid>
                <Stat 
                    title="Task Completion" 
                    color="blue" 
                    icon={<HiOutlineClipboardDocumentCheck />} 
                    value={`${completionRate}%`} 
                />
                <Stat 
                    title="Avg Clean Time" 
                    color="green" 
                    icon={<HiOutlineClock />} 
                    value={`${avgCleaningTime} min`} 
                />
                <Stat 
                    title="Open Maintenance" 
                    color="yellow" 
                    icon={<HiOutlineExclamationTriangle />} 
                    value={openTickets} 
                />
                <Stat 
                    title="Critical Issues" 
                    color="red" 
                    icon={<HiOutlineSparkles />} 
                    value={highPriorityTickets} 
                />
            </StatsGrid>

            {/* Future: Add Productivity Charts here */}
            <div style={{
                color: 'var(--color-grey-500)', 
                textAlign: 'center', 
                padding: '4rem', 
                backgroundColor: 'var(--color-grey-0)',
                borderRadius: 'var(--border-radius-md)',
                marginTop: '1rem'
            }}>
                Detailed operational charts (productivity trends, ticket aging) will appear here as more data is collected.
            </div>
        </StyledReport>
    )
}
