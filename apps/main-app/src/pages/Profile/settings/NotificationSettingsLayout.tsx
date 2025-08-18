import ProfileHeader from "../ProfileHeader"
import NotificationSettingsTab from "./NotificationSettingsTab";


function NotificationSettingsLayout() {
  return (
        <div className="text-primary-text mb-32">
          <ProfileHeader />
          <NotificationSettingsTab/>
        </div>
    );
}

export default NotificationSettingsLayout