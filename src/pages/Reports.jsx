import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ReportsLayout from "../features/reports/ReportsLayout";

function Reports() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Reports & Analytics</Heading>
        {/* We can add an 'Export All' button here later */}
      </Row>

      <ReportsLayout />
    </>
  );
}

export default Reports;
