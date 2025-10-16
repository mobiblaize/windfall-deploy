// // RaffleFormContext.tsx
// import { createContext, useContext, type ReactNode } from "react";
// import { useForm, type UseFormReturnType } from "@mantine/form";

// // 1️⃣ Define the shape of the form values
// interface RaffleFormValues {
//   name: string;
//   instant_game: boolean;
//   total_tickets: string;
//   ticket_price: string;
//   description: string;
//   long_description: string;
//   category_id: string;
//   percentage_markup: string;
//   discount_type: string;
//   discount_percentage: string;
//   tiers: any[];
//   prizes: any[];
//   is_scheduled: boolean;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   cta_text: string;
//   allow_promo_code_usage: boolean;
//   allow_referral_balance_usage: boolean;
//   supporting_text: string;
//   competition_details: string;
//   sponsorship_details: string;
//   other_information: string;
//   documents: string;
//   is_active: boolean;
//   status: string;
// }

// // 2️⃣ Create context with proper type
// const RaffleFormContext = createContext<UseFormReturnType<RaffleFormValues> | null>(null);

// interface RaffleFormProps {
//   children: ReactNode;
// }

// export function RaffleFormProvider({ children }: RaffleFormProps) {
//   const form = useForm<RaffleFormValues>({
//     initialValues: {
//       name: "",
//       instant_game: false,
//       total_tickets: "",
//       ticket_price: "",
//       description: "",
//       long_description: "",
//       category_id: "",
//       percentage_markup: "",
//       discount_type: "",
//       discount_percentage: "",
//       tiers: [],
//       prizes: [],
//       is_scheduled: false,
//       start_date: "",
//       end_date: "",
//       start_time: "",
//       end_time: "",
//       cta_text: "",
//       allow_promo_code_usage: false,
//       allow_referral_balance_usage: false,
//       supporting_text: "",
//       competition_details: "",
//       sponsorship_details: "",
//       other_information: "",
//       documents: "",
//       is_active: true,
//       status: "draft",
//     },
//   });

//   return (
//     <RaffleFormContext.Provider value={form}>
//       {children}
//     </RaffleFormContext.Provider>
//   );
// }

// // 3️⃣ Custom hook with non-null assertion for cleaner usage
// export const useRaffleForm = () => {
//   const context = useContext(RaffleFormContext);
//   if (!context) throw new Error("useRaffleForm must be used within RaffleFormProvider");
//   return context;
// };
