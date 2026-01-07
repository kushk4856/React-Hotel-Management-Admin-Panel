import styled from "styled-components";
import Stat from "../dashboard/Stat";
import { 
  HiOutlineBriefcase, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineWrenchScrewdriver
} from "react-icons/hi2";
import { useHousekeepingTasks } from "./useHousekeepingTasks";
import { useHousekeepingSubscription } from "./useHousekeepingSubscription";
import { useMaintenanceTickets } from "../maintenance/useMaintenanceTickets";
import { useUser } from "../authentication/useUser";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Container = styled.div`
  margin-bottom: 2.4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.6rem;
  margin-bottom: 2.4rem;
`;

const ChartsContainer = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-100);
  margin-bottom: 2.4rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  h3 {
    margin: 0 0 2rem 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
`;

const COLORS = {
  todo: '#6366f1',
  in_progress: '#f59e0b',
  done: '#22c55e',
  verified: '#10b981',
  checkout: '#ef4444',
  stayover: '#3b82f6',
  deep: '#8b5cf6',
  inspection: '#ec4899',
};

function DashboardStats() {
  useHousekeepingSubscription();
  const { tasks, isLoading } = useHousekeepingTasks();
  const { tickets } = useMaintenanceTickets();
  const { user } = useUser();

  if (isLoading) return <div>Loading Stats...</div>;

  const myTasks = tasks?.filter(t => t.assigned_to === user?.id) || [];
  const totalAssigned = myTasks.length;
  const done = myTasks.filter(t => t.status === "done" || t.status === "verified").length;
  const remaining = totalAssigned - done;
  const priorityRooms = myTasks.filter(t => t.priority === "high" || t.task_type === "checkout_clean").length;
  const needsInspection = myTasks.filter(t => t.status === "done").length;
  const myOpenIssues = tickets?.filter(t => 
    myTasks.some(task => task.cabin_id === t.cabin_id) && 
    t.status !== "resolved"
  ).length || 0;

  // Pie chart data
  const statusData = [
    { name: 'To Do', value: myTasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: myTasks.filter(t => t.status === 'in_progress').length },
    { name: 'Done', value: myTasks.filter(t => t.status === 'done').length },
    { name: 'Verified', value: myTasks.filter(t => t.status === 'verified').length },
  ].filter(item => item.value > 0);

  const typeData = [
    { name: 'Checkout', value: myTasks.filter(t => t.task_type === 'checkout_clean').length },
    { name: 'Stayover', value: myTasks.filter(t => t.task_type === 'stayover_clean').length },
    { name: 'Deep Clean', value: myTasks.filter(t => t.task_type === 'deep_clean').length },
    { name: 'Inspection', value: myTasks.filter(t => t.task_type === 'inspection').length },
  ].filter(item => item.value > 0);

  return (
    <Container>
      <StatsGrid>
        <Stat
          title="My Tasks"
          color="blue"
          icon={<HiOutlineBriefcase />}
          value={`${done}/${totalAssigned}`}
        />
        <Stat
          title="Remaining"
          color="yellow"
          icon={<HiOutlineClock />}
          value={remaining}
        />
        <Stat
          title="Priority"
          color="red"
          icon={<HiOutlineExclamationCircle />}
          value={priorityRooms}
        />
        <Stat
          title="Re-check"
          color="indigo"
          icon={<HiOutlineCheckCircle />}
          value={needsInspection}
        />
        <Stat
          title="Issues"
          color="silver"
          icon={<HiOutlineWrenchScrewdriver />}
          value={myOpenIssues}
        />
      </StatsGrid>

      {totalAssigned > 0 && (
        <ChartsContainer>
          <ChartsGrid>
            <ChartBox>
              <h3>Task Status Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={50}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox>
              <h3>Task Type Breakdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={50}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS).slice(4)[index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>
          </ChartsGrid>
        </ChartsContainer>
      )}
    </Container>
  );
}

export default DashboardStats;
