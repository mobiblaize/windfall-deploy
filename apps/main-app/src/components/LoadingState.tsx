import { Text, Image } from "@mantine/core";
import loadingImg from "../assets/loading.gif";

type props = {
  title?: string;
  description?: string;
};

function LoadingState({ title="Loading, Please wait...", description="Fetching your data"}: props) {
  return (
    <div
      className="!w-4/5 !mx-auto mt-10 !p-10"
    >
      <div className="!text-center !mx-auto">

        
        <Image
          src={loadingImg}
          alt={'Loading'}
          className="w-[100px] h-[100px] mx-auto mb-5"
          fit="contain"
          radius="md"
        />
        <Text className="!font-semibold !text-primary-text !text-2xl">{title}</Text>
        <Text className="!text-secondary-text" my="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

export default LoadingState;
