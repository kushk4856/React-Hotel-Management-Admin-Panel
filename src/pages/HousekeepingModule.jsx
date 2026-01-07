import { useUser } from "../features/authentication/useUser";
import HousekeepingDashboard from "./HousekeepingDashboard"; // Staff View
import MyRooms from "./MyRooms"; // Manager View (Table with Assignment)
// Ideally, Manager view should be a new 'HousekeepingOversight' component, 
// but 'MyRooms' (the table) is what they need for oversight + assignment.

import Spinner from "../ui/Spinner";

function HousekeepingModule() {
  const { role, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  // Manager/Admin gets the Oversight View (Table + Assign Links)
  if (role === 'manager' || role === 'admin') {
    return <MyRooms />; 
  }

  // Staff gets the Personal Dashboard
  return <HousekeepingDashboard />;
}

export default HousekeepingModule;
