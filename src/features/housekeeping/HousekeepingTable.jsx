/* eslint-disable react/prop-types */
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useHousekeepingTasks } from "./useHousekeepingTasks";
import { useHousekeepingSubscription } from "./useHousekeepingSubscription";
import HousekeepingRow from "./HousekeepingRow";

function HousekeepingTable() {
  useHousekeepingSubscription(); // Enable Realtime Sync
  const { isLoading, tasks } = useHousekeepingTasks();

  if (isLoading) return <Spinner />;
  if (!tasks.length) return <Empty resourceName="tasks" />;

  return (
    <Menus>
      <Table columns="1fr 1fr 1fr 1fr 2fr">
        <Table.Header>
          <div>Cabin</div>
          <div>Assigned To</div>
          <div>Date</div>
          <div>Status</div>
          <div>Notes</div>
        </Table.Header>

        <Table.Body
          data={tasks}
          render={(task) => <HousekeepingRow key={task.id} task={task} />}
        />
      </Table>
    </Menus>
  );
}

export default HousekeepingTable;
