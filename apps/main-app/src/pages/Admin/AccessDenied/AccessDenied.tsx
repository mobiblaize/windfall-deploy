import { Card, Text, Button, Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLock } from "@tabler/icons-react";
import { useAdminMenu } from "../../../utils/hooks/useAdminMenu";

interface AccessDeniedProps {
  moduleName?: string;
}

export default function AccessDenied({ moduleName }: AccessDeniedProps) {
  const navigate = useNavigate();
  const menuSections = useAdminMenu();

  // Find the first accessible route and its module name from the menu
  const firstAccessibleMenuItem = menuSections
    .flatMap((section) => section.items)
    .find((item) => item.path);
  
  const firstAccessibleRoute = firstAccessibleMenuItem?.path;
  const firstAccessibleModuleName = firstAccessibleMenuItem?.requiredModule;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    if (firstAccessibleRoute) {
      navigate(firstAccessibleRoute);
    } else {
      // If no accessible routes, go to login
      navigate("/admin/login");
    }
  };

  const handleBackToLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card
        withBorder
        shadow="sm"
        radius="md"
        className="!w-full !max-w-2xl !mx-auto !p-10"
      >
        <Stack align="center" gap="lg">
          <div className="p-4 rounded-full w-fit bg-red-50 mx-auto">
            <IconLock className="text-primary-red" size={64} stroke={1.5} />
          </div>

          <Stack align="center" gap="xs">
            <Title order={2} className="!font-semibold !text-2xl !text-center">
              Access Denied
            </Title>
            <Text className="!text-secondary-text !text-center !max-w-md">
              {moduleName
                ? `You don't have permission to access ${moduleName}. Please contact your administrator if you believe this is an error.`
                : "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
            </Text>
          </Stack>

          <Stack gap="sm" mt="md">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="!border !border-primary-red !text-primary-red hover:!bg-red-50 !px-7 !h-12 !tracking-wide"
            >
              Go Back
            </Button>
            {firstAccessibleRoute ? (
              <Button
                onClick={handleGoToDashboard}
                className="!bg-primary-red hover:!bg-red-700 !capitalize !px-7 !h-12 !tracking-wide"
              >
                Go to {firstAccessibleModuleName || "Dashboard"}
              </Button>
            ) : (
              <Button
                onClick={handleBackToLogin}
                className="!bg-primary-red hover:!bg-red-700 !px-7 !h-12 !tracking-wide"
              >
                Back to Login
              </Button>
            )}
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

