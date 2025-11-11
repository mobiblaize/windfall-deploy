import {
  Container,
  Divider,
  Flex,
  Image,
  Indicator,
  Text,
} from "@mantine/core";
import HelpSection from "../../components/HelpSection";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../components/Buttons/CustomButton";
import { useFetchData } from "../../utils/hooks/useApis";
import type { Winner } from "./AllWinnersPage";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { formatCurrency } from "../../utils/helper/formatCurrency";

function WinnerStory() {
  const navigate = useNavigate();
  const [winnerStory, setWinnerStory] = useState<Winner>();
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchData(`guest/winner/${id}/testimonial`);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: "Failed to fetch Winner Story",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (response) {
      setWinnerStory(response.data);
    }
  }, [error, isError, response]);

  return (
    <div className="mb-10 flex flex-col h-full  md:mx-10 lg:mx-14 mt-10">
      {isLoading && (
        <LoadingState description="Fetching winner story from the system." />
      )}
      {!isLoading && (
        <>
          {winnerStory ? (
            <section className="text-primary-text p-4">
              <Text className="!font-bold !text-xl sm:!text-2xl md:!text-3xl lg:!text-4xl ">
                {winnerStory?.testimonial_short_description}
              </Text>

              {renderImageGrid(winnerStory?.media).top}

              <div className="my-5 ">
                {" "}
                <Divider variant="dashed" color="var(--color-primary-red)" />
                <Flex
                  mih={50}
                  bg="var(--color-secondary-red)"
                  gap="md"
                  justify="space-around"
                  align="center"
                  direction="row"
                  wrap="nowrap"
                >
                  <div className="flex gap-x-2 items-center ">
                    <span className="bg-primary-red/30 p-2">
                      <Indicator
                        color="var(--color-primary-red)"
                        className="z-0"
                      />
                    </span>
                    <p>
                      <span className="text-secondary-text">Prize Value:</span>{" "}
                      {formatCurrency(winnerStory?.prize_cost || 0)}
                    </p>
                  </div>
                  <Divider
                    orientation="vertical"
                    my="xs"
                    color="var(--color-primary-red)"
                  />

                  <div className="flex gap-x-2 items-center">
                    <span className="bg-primary-red/30 p-2">
                      <Indicator
                        color="var(--color-primary-red)"
                        className="z-0"
                      />
                    </span>
                    <p>
                      <span className="text-secondary-text">Prize:</span>{" "}
                      {winnerStory?.prize_won}
                    </p>
                  </div>
                  <Divider
                    orientation="vertical"
                    my="xs"
                    color="var(--color-primary-red)"
                  />

                  <div className="flex gap-x-2 items-center">
                    <span className="bg-primary-red/30 p-2">
                      <Indicator
                        color="var(--color-primary-red)"
                        className="z-0"
                      />
                    </span>
                    <p>
                      <span className="text-secondary-text">Raffle Name:</span>{" "}
                      {winnerStory?.game_name}
                    </p>
                  </div>
                </Flex>
                <Divider variant="dashed" color="var(--color-primary-red)" />
              </div>
              <Container size="xs" className="my-7 md:my-10 lg:my-14">
                <div
                  dangerouslySetInnerHTML={{
                    __html: winnerStory?.testimonial ?? "",
                  }}
                ></div>
              </Container>

              {renderImageGrid(winnerStory?.media).bottom}
              
              {winnerStory?.video_url && (
                <Container size="xs" className="my-7 md:my-10 lg:my-14">
                  <Divider my="xl" />
                  <CustomButton
                    className="!capitalize !bg-primary-text"
                    onClick={() => window.open(winnerStory.video_url, "_blank")}
                  >
                    watch video interview
                  </CustomButton>
                </Container>
              )}
              <Container
                className="!bg-[#030303] !py-3 rounded-xl !mb-7 md:!mb-14 relative h-fit"
                size="xl"
              >
                <HelpSection
                  heading={<>How to Claim Your Prize</>}
                  description="Follow these simple steps to verify and receive your winnings."
                  buttonText="Let's Talk"
                  onClick={() => navigate("/contact-us")}
                />
              </Container>
            </section>
          ) : (
            <div className="mt-10">
              <EmptyState
                description="Winner story not found"
                title="No Records Found"
                format="secondary"
                fullWidth={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WinnerStory;

const renderImageGrid = (media?: string[]) => {
  if (!media || media?.length === 0)
    return {
      top: null,
      bottom: null,
    };

  const firstFourImages = media?.slice(0, 4);
  const remainingImages = media?.slice(4);

  return {
    top: (
      <>
        {/* IMAGES SECTION 1 */}
        {media.length === 1 && (
          <div className="my-10">
            <div className="rounded-lg overflow-hidden w-full">
              <Image
                src={media[0]}
                alt="Winner image 1"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {media.length === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 my-10">
            {media.map((img, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`Winner image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {media.length === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 my-10 sm:h-[200px] md:h-[300px] lg:h-[400px]">
            <div className="sm:row-span-2 rounded-lg overflow-hidden h-full">
              <Image
                src={media[0]}
                alt="Winner image 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-full">
              <Image
                src={media[1]}
                alt="Winner image 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-full">
              <Image
                src={media[2]}
                alt="Winner image 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {media.length >= 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 my-10 sm:h-[200px] md:h-[300px] lg:h-[400px]">
            <div className="sm:row-span-2 rounded-lg overflow-hidden h-full">
              <Image
                src={firstFourImages[0]}
                alt="Winner image 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-full">
              <Image
                src={firstFourImages[1]}
                alt="Winner image 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:row-span-2 rounded-lg overflow-hidden h-full">
              <Image
                src={firstFourImages[2]}
                alt="Winner image 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-full">
              <Image
                src={firstFourImages[3]}
                alt="Winner image 4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* IMAGES SECTION 2 - For remaining images (5+) */}
      </>
    ),
    bottom: remainingImages.length > 0 && (
      <Container
        size="xl"
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7 my-7 md:my-10"
      >
        {remainingImages.map((img, idx) => (
          <div key={idx + 4} className="rounded-lg overflow-hidden">
            <Image
              src={img}
              alt={`Winner image ${idx + 5}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Container>
    ),
  };
};
