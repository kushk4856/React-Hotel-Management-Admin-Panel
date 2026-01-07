import Heading from "../ui/Heading";
import Row from "../ui/Row";
import HousekeepingTable from "../features/housekeeping/HousekeepingTable";

function Housekeeping() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Housekeeping Tasks</Heading>
        {/* We can add 'Create Task' button here later for Admins */}
      </Row>

      <Row>
        <HousekeepingTable />
      </Row>
    </>
  );
}

export default Housekeeping;
