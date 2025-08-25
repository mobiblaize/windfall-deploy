import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Divider } from "@mantine/core";
import ProfileHeader from "./ProfileHeader";
import DynamicBreadcrumbs, { type Crumb } from "../../components/DynamicBreadCrumbs";

function ProfileLayout() {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const location = useLocation();

  useEffect(() => {
    // clear crumbs on every navigation
    setCrumbs([]);
  }, [location.pathname]);

  return (
    <div className="text-primary-text mb-32">
      {crumbs.length > 0 && (
        <div className="px-10 bg-white py-3">
          <DynamicBreadcrumbs items={crumbs} />
          <Divider className="!shadow-lg" />
        </div>
      )}

      <ProfileHeader />
      <Outlet context={{ setCrumbs }} />
    </div>
  );
}

export default ProfileLayout;
