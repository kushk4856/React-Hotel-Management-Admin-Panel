/* eslint-disable react/prop-types */
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useHousekeepingTasks } from "./useHousekeepingTasks";
import HousekeepingRow from "./HousekeepingRow";
import { useUser } from "../authentication/useUser";

function MyTasksTable() {
  const { isLoading, tasks } = useHousekeepingTasks();
  const { user } = useUser();

  if (isLoading) return <Spinner />;

  const myTasks = tasks?.filter(task => task.assigned_to === user.id) || [];

  if (!myTasks?.length) return <Empty resourceName="assigned tasks" />;

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
          data={myTasks}
          render={(task) => <HousekeepingRow key={task.id} task={task} />}
        />
      </Table>
    </Menus>
  );
}

export default MyTasksTable;
