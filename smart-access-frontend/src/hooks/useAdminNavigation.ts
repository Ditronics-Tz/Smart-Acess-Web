import { useNavigate } from 'react-router-dom';

export const useAdminNavigation = () => {
  const navigate = useNavigate();

  const handleSidebarNavigation = (view: string) => {
    switch (view) {
      case "dashboard":
        navigate('/admin-dashboard');
        break;
      case "users":
        navigate('/admin-dashboard/users');
        break;
      case "security":
        navigate('/admin-dashboard/security');
        break;
      case "locations":
        navigate('/admin-dashboard/locations');
        break;
      case "access-gates":
        navigate('/admin-dashboard/gates');
        break;
      case "reports":
        navigate('/admin-dashboard/reports');
        break;
      case "settings":
        navigate('/admin-dashboard/settings');
        break;
      default:
        navigate('/admin-dashboard');
    }
  };

  return handleSidebarNavigation;
};