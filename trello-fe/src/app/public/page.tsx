import { auth } from "@/config/auth.config";
import AdminDashboard from "@/modules/dashboard/components/AdminDashboard";
import { getDashboardData } from "@/modules/dashboard/services/dashboard.service";
import { UserRole } from "@/modules/user/enums/user-role";
import { UserHelper } from "@/modules/user/helpers/user.helper";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData();

  if (UserHelper.isSuperAdmin(session?.user.role as UserRole)) {
    // TODO: Show dashboard by role
  }

  return <AdminDashboard data={data} />;
}
