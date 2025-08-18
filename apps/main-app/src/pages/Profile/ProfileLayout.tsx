import ProfileHeader from "./ProfileHeader";
import GamesTab from "./GamesTab";
// import { Anchor, Breadcrumbs } from "@mantine/core";
// const items = [
// 	{ title: "profile", href: "/profile" },
// 	{ title: "games", href: "/profile/all-games" },
// ].map((item, index) => (
// 	<Anchor href={item.href} key={index}>
// 		{item.title}
// 	</Anchor>
// ));
function ProfileLayout() {
	return (
		<div className="text-primary-text mb-32">
			{/* <Breadcrumbs>{items}</Breadcrumbs> */}

			<ProfileHeader />
			<GamesTab />
		</div>
	);
}

export default ProfileLayout;
