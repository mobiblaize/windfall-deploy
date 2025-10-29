import loadingImg from "../assets/loading.gif";
import { Box, Image } from "@mantine/core";

export default function LoadingScreen() {
  return (
    <Box
      style={{
        backgroundColor: "#0b0b0b", // dark background
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={loadingImg}
        alt="Loading..."
        width={70} // reduced size
        height={70}
        fit="contain"
        style={{
          opacity: 0.9,
        }}
      />
    </Box>
  );
}
