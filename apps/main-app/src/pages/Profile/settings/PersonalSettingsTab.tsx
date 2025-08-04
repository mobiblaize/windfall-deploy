import {
  Card,
  Container,
  TextInput,
  Divider,
  Select,
  Button,
  Grid,
} from "@mantine/core";
import MyGameHeader from "../MyGameHeader";
// import { useNavigate } from "react-router-dom";
import raffleImg from "../../../assets/default-raffle.png";
import { useState } from "react";

type StateKey = keyof typeof dummyLGAs;
type LGAOption = (typeof dummyLGAs)[StateKey][number];

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

const dummyStates = [
  { value: "lagos", label: "Lagos State" },
  { value: "oyo", label: "Oyo State" },
  { value: "abuja", label: "FCT" },
];

const dummyLGAs = {
  lagos: [
    { value: "kosofe", label: "Kosofe" },
    { value: "ikeja", label: "Ikeja" },
  ],
  oyo: [
    { value: "ibadan-north", label: "Ibadan North" },
    { value: "ibadan-south", label: "Ibadan South" },
  ],
  abuja: [
    { value: "garki", label: "Garki" },
    { value: "wuse", label: "Wuse" },
  ],
};

function PersonalSettingsTab() {
  const [profilePic, setProfilePic] = useState(raffleImg);
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState<StateKey>("lagos");
  const [lga, setLga] = useState<LGAOption["value"]>("kosofe");

  return (
    <div>
      <MyGameHeader
        title="Personal Information"
        description="Edit your personal information with ease today."
      >
        <Button
          className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red"
          px={30}
        >
          Save Changes
        </Button>
      </MyGameHeader>
      <Divider />

      <Container fluid>
        <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !py-9 !max-w-4xl !mx-auto !my-10 space-y-6">
          {/* Full Name */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <h3 className="font-semibold text-lg text-gray-800">Full Name</h3>
              <p className="text-base text-gray-500">
                For identity verification and prize claim legitimacy.
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                placeholder="First Name, Middle Name Last Name"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
              />
            </Grid.Col>
          </Grid>

          {/* Email Address */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                Email Address
              </h3>
              <p className="text-base text-gray-500">
                For login credentials, confirmation, notifications, and draw
                results.
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                value="olamidesoc@gmail.com"
                disabled
                styles={inputStyles}
              />
              <p className="text-sm mt-1 text-gray-500">
                So sorry, you can’t change or update your email address
              </p>
            </Grid.Col>
          </Grid>

          {/* Phone Number */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                Phone Number
              </h3>
              <p className="text-base text-gray-500">
                For SMS alerts, verification, and follow-up (especially in
                Nigeria).
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                value="+234 90 4747 2791"
                disabled
                styles={inputStyles}
              />
              <p className="text-sm mt-1 text-gray-500">
                So sorry, you can’t change or update your phone number
              </p>
            </Grid.Col>
          </Grid>

          {/* Date of Birth */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                Date of Birth / Age Confirmation
              </h3>
              <p className="text-base text-gray-500">
                To ensure the participant is above 18 (legally required in most
                jurisdictions).
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <TextInput
                value="April 28, 2000 (25 years)"
                disabled
                styles={inputStyles}
              />
              <p className="text-sm mt-1 text-gray-500">
                You are eligible to play game as you are more than 18 years of
                Age
              </p>
            </Grid.Col>
          </Grid>

          {/* Location */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <h3 className="font-semibold text-lg text-gray-800">Location</h3>
              <p className="text-base text-gray-500">
                Select your state and local government area
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Grid gutter="sm">
                <Grid.Col span={6}>
                  <Select
                    data={dummyStates}
                    value={state}
                    onChange={(value) => {
                      const newState = value as StateKey;
                      setState(newState);
                      setLga(dummyLGAs[newState]?.[0]?.value || "");
                    }}
                    styles={inputStyles}
                    placeholder="Select State"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    data={dummyLGAs[state]}
                    value={lga}
                    onChange={(value) => setLga(value as LGAOption["value"])}
                    placeholder="Select LGA"
                    styles={inputStyles}
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          {/* Profile Picture */}
          {/* Profile Picture */}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                Profile Picture
              </h3>
              <p className="text-base text-gray-500">
                Helps for KYC (Know Your Customer) processes and for displaying
                verified winners.
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                id="profilePicInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setProfilePic(imageUrl);
                  }
                }}
              />

              <Button
                variant="outline"
                h={80}
                color="red"
                className="!flex !items-center !bg-secondary-red !rounded-xl"
                onClick={() =>
                  document.getElementById("profilePicInput")?.click()
                }
              >
                <img
                  src={profilePic}
                  alt="profile"
                  className="w-10 h-10 mr-2 rounded-full object-cover"
                />
                <span className="text-lg font-semibold text-black">
                  Click to Change Profile
                </span>
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
    </div>
  );
}

export default PersonalSettingsTab;
