import {
  Card,
  Text,
  Title,
  Container,
  Grid,
  Flex,
  Textarea,
  Box,
  Skeleton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import type { Complaints } from "./Support";
import { format } from "date-fns";

const breadCrumbs: Crumb[] = [
  { label: "Customer Support", to: "/admin/support" },
  { label: "View Customer Support Details" },
];

export default function ViewComplaint() {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState("");
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  const {
    data: complaintResponse,
    isLoading: isComplaintLoading,
    isError: isComplaintError,
    error: complaintError,
  } = useFetchData(`admin/customer-support-management/show/${id}`);

  const updateComplaintMutation = usePutData(
    `admin/customer-support-management/update/${id}`
  );

  useEffect(() => {
    if (isComplaintError) {
      notifications.show({
        title: "Failed to fetch User",
        message:
          (complaintError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [complaintError, isComplaintError]);

  const complaint: Complaints | undefined = complaintResponse?.data?.support;

  const updateComplaint = async () => {
    if (!comment) {
      return;
    }

    const payload = {
      staff_resolution_comment: comment,
    };

    try {
      const response = await updateComplaintMutation.mutateAsync(payload);
      notifications.show({
        title: "Complaint Update Successful",
        message: response?.message || "Complaint updated successfully",
        color: "green",
      });
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Complaint Update Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

  function allComplaints() {
    setSuccessModalOpen(false);
    navigate(`/admin/support`, { replace: true });
  }

  function closeResolveModal() {
    setResolveModalOpen(false);
    setComment("");
  }

  const isResolved = complaint?.status?.toLowerCase() === "resolved";

  return (
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>

      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2">
          <Flex mb="lg" justify="space-between" align={"self-start"}>
            <div>
              {isComplaintLoading ? (
                <Skeleton height={28} width={300} radius="sm" />
              ) : (
                <Title className="!text-primary-text text-2xl" order={2}>
                  {complaint?.customer?.firstname} {complaint?.customer?.lastname} (
                  {complaint?.uniqueID})
                </Title>
              )}

              {isComplaintLoading ? (
                <Skeleton height={14} width={420} mt={6} radius="sm" />
              ) : (
                <Text className="!text-secondary-text">
                  View and manage customer support details and resolve complaints
                </Text>
              )}
            </div>

            {/* show Resolve button only when not resolved and not loading */}
            {(!isResolved && !isComplaintLoading) && (
              <CustomButton
                size="lg"
                border={false}
                fullWidth={false}
                variant="default"
                onClick={() => setResolveModalOpen(true)}
              >
                <span className="!font-medium">Resolve Complaint</span>
              </CustomButton>
            )}

            {/* show skeleton where button would be while loading (keeps layout) */}
            {!isResolved && isComplaintLoading && (
              <Skeleton height={40} width={160} radius="sm" />
            )}

            {isResolved && !isComplaintLoading && (
              <div className="flex items-center justify-center text-lg font-medium p-3 rounded-xl text-white bg-primary-green">
                Resolved
              </div>
            )}
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        <form>
          <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
            {/* Issued raised header */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={12}>
                <h3 className="font-bold text-xl text-primary-red">
                  Issued raised
                </h3>
                <p className="text-base text-secondary-text">
                  A look at the issue raised by customer via support
                </p>
              </Grid.Col>
            </Grid>

            {/* Customer Details */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Customer Details <span className="text-red-500">*</span>
                </h3>
                <p className="text-base text-secondary-text">
                  Details of the customer
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                {isComplaintLoading ? (
                  <div>
                    <Skeleton height={20} width={260} radius="sm" />
                    <Skeleton height={14} width={180} mt={8} radius="sm" />
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-800">
                      {complaint?.customer?.firstname} {complaint?.customer?.lastname}
                    </h3>
                    <p className="text-base text-secondary-text">
                      ID: {complaint?.customer?.uniqueID}
                    </p>
                  </>
                )}
              </Grid.Col>
            </Grid>

            {/* Issue Details */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Issue Details
                </h3>
                <p className="text-base text-secondary-text">
                  Details of issued raised
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                {isComplaintLoading ? (
                  <div>
                    <Skeleton height={20} width={240} radius="sm" />
                    <Skeleton height={14} width={200} mt={8} radius="sm" />
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-800">
                      {complaint?.issue_type}
                    </h3>
                    <p className="text-base text-secondary-text">
                      {complaint?.updated_at
                        ? format(new Date(complaint.updated_at), "MMMM d, yyyy | h:mm a")
                        : "—"}
                    </p>
                  </>
                )}
              </Grid.Col>
            </Grid>

            {/* Complaint Details */}
            <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <h3 className="font-semibold text-lg text-gray-800">
                  Complaint Details
                </h3>
                <p className="text-base text-secondary-text">
                  Details of the Complaint
                </p>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                {isComplaintLoading ? (
                  <div>
                    <Skeleton height={22} width={520} radius="sm" />
                    <Skeleton height={14} width={160} mt={8} radius="sm" />
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-800">
                      {complaint?.customer_complaint}
                    </h3>
                    <p className="text-base text-secondary-text">
                      ID: {complaint?.uniqueID}
                    </p>
                  </>
                )}
              </Grid.Col>
            </Grid>

            {/* Resolution details (only show after resolved & not loading) */}
            {isResolved && !isComplaintLoading && (
              <>
                <Grid gutter="md" className="!pb-6 !mb-1 -mt-3">
                  <Grid.Col span={{ base: 12 }}>
                    <Box
                      className="border-y border-dashed border-primary-red bg-secondary-red"
                      px={"md"}
                      py={"md"}
                      my={"md"}
                    >
                      <Text tt="capitalize" fw={700}>
                        Resolution Details
                      </Text>
                      <Text tt="capitalize" c="var(--secondary-text)">
                        Complaints resolution details by customer support
                        personnel
                      </Text>
                    </Box>
                  </Grid.Col>
                </Grid>

                <Grid
                  gutter="md"
                  className="border-b border-[#C0C0C5] !pb-6 !mb-6"
                >
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Resolved by
                    </h3>
                    <p className="text-base text-secondary-text">
                      Customer complaints was resolved by ?
                    </p>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 7 }}>
                    <h3 className="font-medium text-gray-800">
                      This is complaints that the customer would submitThis is
                      complaints that the customer would submitThis is
                      complaints that the customer would submitThis is
                      complaints that the customer would submit
                    </h3>
                    <p className="text-base text-secondary-text">ID:8003</p>
                  </Grid.Col>
                </Grid>

                <Grid
                  gutter="md"
                  className="border-b border-[#C0C0C5] !pb-6 !mb-6"
                >
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Why resolve ?
                    </h3>
                    <p className="text-base text-secondary-text">
                      Why customer complaints was resolved
                    </p>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 7 }}>
                    <h3 className="font-medium text-gray-800">
                      {complaint?.staff_resolution_comment}
                    </h3>
                    <p className="text-base text-secondary-text">
                      ID: {complaint?.uniqueID}
                    </p>
                  </Grid.Col>
                </Grid>
              </>
            )}

            {/* If resolved but still loading (edge case) show skeletons */}
            {isResolved && isComplaintLoading && (
              <div className="py-6">
                <Skeleton height={20} width={300} radius="sm" />
                <Skeleton height={20} width={520} mt={8} radius="sm" />
              </div>
            )}
          </Card>
        </form>
      </Container>

      <AdminAlertModal
        opened={resolveModalOpen}
        onClose={closeResolveModal}
        size="lg"
        title={<div className="!text-start">Why Resolve</div>}
        description={
          <div className="!text-start -mt-3">
            <Text className="!text-base !text-start !text-[#818181] !mb-5">
              Provide a reason as to why this resolution
              <br />
            </Text>

            <Textarea
              label="Provide more context "
              required
              placeholder="Provide more context as to why this resolution"
              autosize
              minRows={4}
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
              classNames={{ label: "text-xs font-medium capitalize" }}
            />
            <Text fz="xs" mt={4} c="dimmed">
              120 characters, including spaces & punctuation
            </Text>
          </div>
        }
        primaryButton={{
          disabled: !comment,
          label: "Yes, Resolve Case",
          onClick: () => {
            setResolveModalOpen(false);
            setConfirmModalOpen(true);
          },
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => closeResolveModal(),
        }}
      />

      <AdminAlertModal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        status="error"
        title="Resolve Complaints ?"
        description="Are you sure you want to Resolve this complaint?"
        primaryButton={{
          label: "Yes, Resolve Case",
          onClick: updateComplaint,
          disabled: updateComplaintMutation.isPending,
          loading: updateComplaintMutation.isPending,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setConfirmModalOpen(false),
        }}
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={successModalOpen}
        onClose={allComplaints}
        status="success"
        title="Case Resolved"
        description="Case has been successfully resolved"
        primaryButton={{
          label: "Close",
          onClick: allComplaints,
        }}
      />
    </div>
  );
}
