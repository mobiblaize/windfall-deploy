import ProfileHeader from "../ProfileHeader"
import SettingsTab from "./SettingsTab";


function SettingsLayout() {
  return (
        <div className="text-primary-text mb-32">
          <ProfileHeader />
          <SettingsTab/>
        </div>
    );
}

export default SettingsLayout