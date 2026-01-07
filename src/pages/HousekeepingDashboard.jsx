import Heading from "../ui/Heading";
import Row from "../ui/Row";
import HousekeepingStats from "../features/housekeeping/HousekeepingStats";
import TodayList from "../features/check-in-out/TodayActivity"; // Reuse or create new? Let's assume we need custom one.
// Actually, let's build the Dashboard structure first.

function HousekeepingDashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Housekeeping Dashboard</Heading>
        <p>Tuesday, 6 Jan 2026</p> {/* TODO: Dynamic Date */}
      </Row>

      <Row>
        <HousekeepingStats />
      </Row>

      {/* 
        TODO: Add Sections 
        - Priority Rooms
        - Quick Actions
      */}
    </>
  );
}

export default HousekeepingDashboard;
