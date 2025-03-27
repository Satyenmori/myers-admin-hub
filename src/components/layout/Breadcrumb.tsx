import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const generateBreadcrumbName = (pathname: string): string => {
    // Convert path to readable format
    switch (pathname) {
      case "dashboard":
        return "Dashboard";
      case "users":
        return "Manage Admin Users";
      case "manage-admin-users":
        return "Manage Admin Users";
      case "manage-support-engineers":
        return "Manage Support Engineers";
      case "dispensaries":
        return "Dispensaries";
      case "service-requests":
        return "Service Requests";
      default:
        return (
          pathname.charAt(0).toUpperCase() +
          pathname.slice(1).replace(/-/g, " ")
        );
    }
  };

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard" className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          if (isLast) {
            return (
              <React.Fragment key={pathname}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {generateBreadcrumbName(pathname)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={pathname}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={routeTo}>{generateBreadcrumbName(pathname)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
