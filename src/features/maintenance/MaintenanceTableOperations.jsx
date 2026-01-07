import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function MaintenanceTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "new", label: "New" },
          { value: "approved", label: "Approved" },
          { value: "in_progress", label: "In Progress" },
          { value: "resolved", label: "Resolved" },
          { value: "closed", label: "Closed" },
        ]}
      />

      <SortBy
        options={[
          { value: "created_at-desc", label: "Sort by Date (recent first)" },
          { value: "created_at-asc", label: "Sort by Date (oldest first)" },
          { value: "priority-desc", label: "Sort by Priority (high first)" },
          { value: "priority-asc", label: "Sort by Priority (low first)" },
        ]}
      />
    </TableOperations>
  );
}

export default MaintenanceTableOperations;
