import styled from "styled-components";
import Stat from "../dashboard/Stat";
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi2";
import { useHousekeepingTasks } from "./useHousekeepingTasks";
import { useHousekeepingSubscription } from "./useHousekeepingSubscription";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2.4rem;
`;

function HousekeepingStats() {
  useHousekeepingSubscription(); // Enable Realtime Sync
  const { tasks, isLoading } = useHousekeepingTasks();

  if (isLoading) return <div>Loading Stats...</div>;

  // Simple Logic for Stats (Client side calculation for now)
  const totalAssigned = tasks?.length || 0;
  const completed = tasks?.filter(t => t.status === "completed").length || 0;
  const pending = tasks?.filter(t => t.status === "pending" || t.status === "cleaning").length || 0;

  return (
    <StatsGrid>
      <Stat
        title="My Tasks"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={totalAssigned}
      />
      <Stat
        title="Pending"
        color="yellow"
        icon={<HiOutlineClock />}
        value={pending}
      />
      <Stat
        title="Completed"
        color="green"
        icon={<HiOutlineCheckCircle />}
        value={completed}
      />
    </StatsGrid>
  );
}

export default HousekeepingStats;
