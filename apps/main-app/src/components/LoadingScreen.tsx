import LoadingState from "./LoadingState";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <LoadingState description="Setting up application..." />
      </div>
    </div>
  );
}
