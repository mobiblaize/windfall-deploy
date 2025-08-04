import ProfileHeader from "../ProfileHeader"
import PersonalSettingsTab from "./PersonalSettingsTab";


function PersonalSettingsLayout() {
  return (
        <div className="text-primary-text mb-32 pt-5">
          <ProfileHeader />
          <PersonalSettingsTab/>
        </div>
    );
}

export default PersonalSettingsLayout