import styled from "styled-components";
import { 
  HiOutlineBriefcase, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineWrenchScrewdriver
} from "react-icons/hi2";
import { useHousekeepingTasks } from "../features/housekeeping/useHousekeepingTasks";
import { useHousekeepingSubscription } from "../features/housekeeping/useHousekeepingSubscription";
import { useMaintenanceTickets } from "../features/maintenance/useMaintenanceTickets";
import { useMaintenanceSubscription } from "../features/maintenance/useMaintenanceSubscription";
import { useUser } from "../features/authentication/useUser";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import MyTasksTable from "../features/housekeeping/MyTasksTable";
import RoomStatusBoard from "../features/housekeeping/RoomStatusBoard";
import AlertsPanel from "../features/housekeeping/AlertsPanel";
import ShiftNotesPreview from "../features/housekeeping/ShiftNotesPreview";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import CreateTaskForm from "../features/housekeeping/CreateTaskForm";
import { HiPlus } from "react-icons/hi2";

const DashboardContainer = styled.div`
  background-color: var(--color-grey-50); 
  min-height: 100vh;
  padding: 2.4rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-700) 100%);
  padding: 2.4rem 3.2rem;
  margin-bottom: 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const HeaderLeft = styled.div`
  h1 {
    color: white;
    margin: 0 0 0.4rem 0;
    font-size: 2.8rem;
    font-weight: 700;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-size: 1.4rem;
  }
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.6rem;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  
  span {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #4ade80;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: 0 0 8px #4ade80;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2.4rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  /* Theme-aware card */
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  border: 1px solid var(--color-grey-100);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const StatIcon = styled.div`
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Use theme-aware colored backgrounds 100-700 */
  background-color: var(--color-${props => props.color}-100);
  
  svg {
    width: 2.8rem;
    height: 2.8rem;
    color: var(--color-${props => props.color}-700);
  }
`;

const StatContent = styled.div`
  flex: 1;
  
  .label {
    font-size: 1.2rem;
    text-transform: uppercase;
    color: var(--color-grey-500);
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 0.4rem;
  }
  
  .value {
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--color-grey-900);
    line-height: 1;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 2.4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  border: 1px solid var(--color-grey-100);
  box-shadow: var(--shadow-sm);
  
  h2 {
    color: var(--color-grey-900);
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 2.4rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const FullWidthCard = styled(Card)`
  margin-bottom: 2.4rem;
`;

const CHART_COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#10b981'];

function HousekeepingDashboard() {
  useHousekeepingSubscription();
  useMaintenanceSubscription(); // Enable Realtime Sync for Tickets
  
  const { tasks, isLoading } = useHousekeepingTasks();
  const { tickets } = useMaintenanceTickets();
  const { user } = useUser();

  if (isLoading) return <div style={{padding: '3.2rem', color: 'var(--color-grey-600)'}}>Loading Dashboard...</div>;

  const myTasks = tasks?.filter(t => t.assigned_to === user?.id) || [];
  const totalAssigned = myTasks.length;
  const done = myTasks.filter(t => t.status === "done" || t.status === "verified").length;
  // const remaining = totalAssigned - done; // Removed as per request
  const priorityRooms = myTasks.filter(t => t.priority === "high" || t.task_type === "checkout_clean").length;
  const needsInspection = myTasks.filter(t => t.status === "done").length;
  const myOpenIssues = tickets?.filter(t => 
    myTasks.some(task => task.cabin_id === t.cabin_id) && 
    t.status !== "resolved"
  ).length || 0;

  // Task status pie chart data
  const statusData = [
    { name: 'To Do', value: myTasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: myTasks.filter(t => t.status === 'in_progress').length },
    { name: 'Done', value: myTasks.filter(t => t.status === 'done').length },
    { name: 'Verified', value: myTasks.filter(t => t.status === 'verified').length },
  ].filter(item => item.value > 0);

  // Mock weekly progress data
  const weeklyData = [
    { day: 'Mon', completed: 8 },
    { day: 'Tue', completed: 12 },
    { day: 'Wed', completed: 10 },
    { day: 'Thu', completed: 15 },
    { day: 'Fri', completed: 14 },
    { day: 'Sat', completed: 11 },
    { day: 'Sun', completed: 9 },
  ];

  return (
    <DashboardContainer>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <h1>Today&apos;s Control Screen</h1>
          <p>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </HeaderLeft>
        
        <HeaderActions>
            <LiveBadge>
              <LiveDot />
              <span>Real-time</span>
            </LiveBadge>

            <Modal>
                <Modal.Open opens="create-task">
                    <Button size="medium" variation="primary">
                        <HiPlus /> Add Task
                    </Button>
                </Modal.Open>
                <Modal.Window name="create-task">
                    <CreateTaskForm />
                </Modal.Window>
            </Modal>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="blue">
            <HiOutlineBriefcase />
          </StatIcon>
          <StatContent>
            <div className="label">Total Tasks</div>
            <div className="value">{totalAssigned}</div>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="green">
            <HiOutlineCheckCircle />
          </StatIcon>
          <StatContent>
            <div className="label">Completed</div>
            <div className="value">{done}</div>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="red">
            <HiOutlineExclamationCircle />
          </StatIcon>
          <StatContent>
            <div className="label">Priority</div>
            <div className="value">{priorityRooms}</div>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="yellow">
            <HiOutlineWrenchScrewdriver />
          </StatIcon>
          <StatContent>
            <div className="label">Issues</div>
            <div className="value">{myOpenIssues}</div>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Two Column Section */}
      <TwoColumnGrid>
        <Card>
          <h2>📋 My Task Sheet</h2>
          <MyTasksTable />
        </Card>

        <Card>
          <h2>Task Status Summary</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{
                    backgroundColor: 'var(--color-grey-0)',
                    border: '1px solid var(--color-grey-200)',
                    color: 'var(--color-grey-700)'
                   }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{textAlign: 'center', padding: '4rem', color: 'var(--color-grey-400)'}}>
              No data available
            </div>
          )}
        </Card>
      </TwoColumnGrid>

      {/* Weekly Progress Chart */}
      <FullWidthCard>
        <h2>📈 Weekly Task Completion</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-600)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-brand-600)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-200)" />
            <XAxis dataKey="day" stroke="var(--color-grey-400)" />
            <YAxis stroke="var(--color-grey-400)" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-grey-0)',
                border: '1px solid var(--color-grey-200)',
                borderRadius: '8px',
                color: 'var(--color-grey-700)'
              }}
            />
            <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="var(--color-brand-600)" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#completedGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </FullWidthCard>

      {/* Room Status Board - Horizontal at Bottom */}
      <FullWidthCard>
        <h2>🏠 Room Status Board</h2>
        <RoomStatusBoard />
      </FullWidthCard>

      {/* Alerts and Communication */}
      <TwoColumnGrid>
        <Card>
          <h2>Alerts & Exceptions</h2>
          <AlertsPanel />
        </Card>

        <Card>
          <h2> Shift Communication</h2>
          <ShiftNotesPreview />
        </Card>
      </TwoColumnGrid>
    </DashboardContainer>
  );
}

export default HousekeepingDashboard;
