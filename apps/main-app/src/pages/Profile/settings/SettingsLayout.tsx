import ProfileHeader from "../ProfileHeader"
import SettingsTab from "./SettingsTab";


function SettingsLayout() {
  return (
        <div className="text-primary-text mb-32 pt-5">
          <ProfileHeader />
          <SettingsTab/>
        </div>
    );
}

export default SettingsLayout