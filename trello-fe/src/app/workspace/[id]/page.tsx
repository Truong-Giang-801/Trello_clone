import { auth } from "@/config/auth.config";
import AdminDashboard from "@/modules/dashboard/components/AdminDashboard";
import { getDashboardData } from "@/modules/dashboard/services/dashboard.service";
import { UserRole } from "@/modules/user/enums/user-role";
import { UserHelper } from "@/modules/user/helpers/user.helper";

export default async function PublicPage() {
  const data = await getPublicData();

  return <AdminDashboard data={data} />;
}
