/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, Title, Flex, Card, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFetchData, useGetExportData } from "../../../utils/hooks/useApis";
import { notifications } from "@mantine/notifications";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { CiCalendar } from "react-icons/ci";
import { useForm } from "@mantine/form";
import { FaAngleDown } from "react-icons/fa";

export interface Reports {
  non_instant_games_report: SingleReport;
  instant_games_report: SingleReport;
  draw_report: SingleReport;
  transaction_report: SingleReport;
  customer_management_report: SingleReport;
}

export interface SingleReport {
  url: string;
  name: string;
  description: string;
  export: boolean;
  fields: Field[];
}

export interface NonInstantGamesReport {
  url: string;
  name: string;
  description: string;
  export: boolean;
  fields: Field[];
}

export interface Field {
  key: string;
  label: string;
  type: 'date' | 'select';
  placeholder?: string;
  required?: boolean;
  rules?: 'after_or_equal:start_date';
  options?: Option[];
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  default?: string;
}

export interface Option {
  value: string;
  label: string;
}

type CardProps = {
  report: SingleReport;
  selectReport: (report: SingleReport) => void;
};

function ReportCard({ report, selectReport }: CardProps) {
  return (
    <Card
      shadow="sm"
      radius="lg"
      padding="lg"
      onClick={() => selectReport(report)}
      className={`rounded-2xl border transition !cursor-pointer border-gray-200 bg-white`}
    >
      <Text className="!text-primary-text !mt-3 !text-xl !leading-snug !font-bold">
        {report.name}
      </Text>
      <Text className="!text-sm !text-gray-600 !mt-1 !leading-snug">
        {report.description}
      </Text>
    </Card>
  );
}

export default function Reports() {
  const [currentReport, setCurrentReport] = useState<SingleReport>();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccessModalOpen, setReportSuccessModalOpen] = useState(false);
  const generateReportMutation = useGetExportData("");

  const form = useForm<Record<string, any>>({
    initialValues: {},
  });

  const {
    data: reportsResponse,
    isLoading: isLoadingReports,
    isError: isErrorReports,
    error: reportsError,
  } = useFetchData("admin/report-management/all-reports");

  useEffect(() => {
    if (isErrorReports) {
      notifications.show({
        title: "Failed to fetch Reports",
        message:
          (reportsError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
  }, [reportsError, isErrorReports, reportsResponse]);

  const reports: Reports | undefined = reportsResponse?.data;

  // Initialize form when a report is selected
  useEffect(() => {
    if (currentReport) {
      const initialValues: Record<string, any> = {};
      const validationRules: Record<string, any> = {};

      currentReport.fields.forEach((field) => {
        // Set initial values
        initialValues[field.key] = field.default || "";

        console.log(field);
        
        // Set validation rules
        if (field.type === "date" && field.rules === "after_or_equal:start_date") {

          console.log('date input');
          
          
          // Complex validation with cross-field dependency
          validationRules[field.key] = (val: any, values: Record<string, any>) => {
            if (!val && field.required) {
              return `${field.label} is required`;
            }
            if (val && values.start_date) {
              const startDate = new Date(values.start_date);
              const endDate = new Date(val);
              if (endDate < startDate) {
                return `${field.label} must be after or equal to Start Date`;
              }
            }
            return null;
          };
        } else if (field.required) {
          // Simple required validation
          validationRules[field.key] = (val: any) =>
            val ? null : `${field.label} is required`;
        }
      });

      // Add validation rules to initial values
      initialValues._validation = validationRules;

      // Reset form completely with new values
      form.reset();
      form.setInitialValues(initialValues);
      form.setValues(initialValues);
      form.clearErrors();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  const handleSubmit = async (values: Record<string, any>) => {
    // Manual validation
    const validationRules = form.values._validation || {};
    const errors: Record<string, string> = {};

    Object.entries(validationRules).forEach(([key, validator]: [string, any]) => {
      const error = validator(values[key], values);
      if (error) {
        errors[key] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      form.setErrors(errors);
      return;
    }

    // Build query params from form values
    const queryParams = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (key === '_validation') return; // Skip validation rules
      
      if (value) {
        // Format dates if needed
        if (value instanceof Date) {
          queryParams.append(key, value.toISOString().split("T")[0]);
        } else if (Array.isArray(value)) {
          // Handle multiple select
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const url = `admin/report-management${currentReport?.url}?${queryParams.toString()}`;

    generateReportMutation.mutate(
      { url },
      {
        onSuccess: (data) => {
          const url = window.URL.createObjectURL(new Blob([data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = `${currentReport?.name} export ${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          notifications.show({
            title: "Export Successful",
            message: "Your file has been downloaded",
            color: "green",
          });

          setReportModalOpen(false);
          setReportSuccessModalOpen(true);
        },
        onError: (error) => {
          notifications.show({
            title: "Export Failed",
            message: error?.message || "An error occurred",
            color: "var(--color-primary-red)",
          });
        },
      }
    );
  };

  const selectReport = (report: SingleReport) => {
    setCurrentReport(report);
    setReportModalOpen(true);
  };

  const reportKeys = reports ? (Object.keys(reports) as (keyof Reports)[]) : [];

  // Render dynamic form fields
  const renderFormFields = () => {
    if (!currentReport?.fields) return null;

    return currentReport.fields.map((field) => {
      if (field.type === "date") {
        return (
          <div key={field.key} className="text-start mb-5">
            <DateInput
              label={field.label}
              placeholder={field.placeholder || `Pick ${field.label.toLowerCase()}`}
              required={field.required}
              classNames={{ input: "placeholder:text-xs" }}
              {...form.getInputProps(field.key)}
              rightSection={<CiCalendar />}
              popoverProps={{
                classNames: {
                  dropdown: "!text-primary-text",
                },
              }}
            />
          </div>
        );
      }

      if (field.type === "select") {
        return (
          <div key={field.key} className="text-start mb-5">
            <Select
              required={field.required}
              rightSection={<FaAngleDown />}
              placeholder={field.placeholder || "Select..."}
              label={field.label}
              data={field.options || []}
              searchable={field.searchable}
              clearable={field.clearable}
              multiple={field.multiple}
              classNames={{
                label: "!capitalize",
                options: "text-primary-text",
              }}
              {...form.getInputProps(field.key)}
            />
          </div>
        );
      }

      return null;
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2">
          <Flex mb="lg" justify="space-between" align={"self-start"}>
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                Report
              </Title>
              <Text className="!text-secondary-text">
                Generate reports across important touch points on system.
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <div className="px-6 md:px-10 py-5">
        {isLoadingReports && (
          <LoadingState description="Fetching reports data from the system." />
        )}
        {!isLoadingReports && (
          <>
            {reportKeys.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportKeys.map((report) => (
                    <ReportCard
                      key={report}
                      report={reports?.[report] as SingleReport}
                      selectReport={selectReport}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                description="Failed to fetch reports"
                format="secondary"
                fullWidth={true}
                title="No reports found"
              />
            )}
          </>
        )}
      </div>

      <AdminAlertModal
        opened={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={`Generate Report`}
        description={
          <div className="mb-10">
            <div className="mb-5">
              Generate a report to stay abreast with game and platform
              performances
            </div>

            {renderFormFields()}
          </div>
        }
        primaryButton={{
          label: "Generate Report",
          disabled: generateReportMutation.isPending,
          loading: generateReportMutation.isPending,
          onClick: () => handleSubmit(form.values),
        }}
        secondaryButton={{
          label: "No, Close",
          onClick: () => setReportModalOpen(false),
        }}
      />

      <AdminAlertModal
        opened={reportSuccessModalOpen}
        onClose={() => setReportSuccessModalOpen(false)}
        status="success"
        title={`Report Generated`}
        description={`Congratulations, Report has been successfully generated.`}
        primaryButton={{
          label: "Close",
          onClick: () => setReportSuccessModalOpen(false),
        }}
      />
    </form>
  );
}