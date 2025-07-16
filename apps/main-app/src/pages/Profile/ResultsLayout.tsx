import ProfileHeader from "./ProfileHeader"
import ResultsTab from "./ResultsTab";


function ResultsLayout() {
  return (
		<div className="text-primary-text mb-32 pt-5">
          <ProfileHeader />
          <ResultsTab/>
		</div>
	);
}

export default ResultsLayout