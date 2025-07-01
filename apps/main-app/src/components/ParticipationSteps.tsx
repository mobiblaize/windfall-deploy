// components/ParticipationSteps.tsx
import { IconUser } from "@tabler/icons-react";

const steps = [
  {
    title: "Register or Log In",
    description:
      "Create your account by signing up or logging in if you already have one.",
  },
  {
    title: "Browse Raffles",
    description:
      "Explore available raffles, read about prizes, entry fees, and deadlines.",
  },
  {
    title: "Purchase Tickets",
    description:
      "Buy tickets directly using preferred payment methods or e-wallet funds.",
  },
  {
    title: "Wait for the Draw",
    description:
      "View countdown and other participants' entries while waiting.",
  },
  {
    title: "Check Results",
    description:
      "Check results on the website and receive notifications via email/SMS.",
  },
  {
    title: "Claim Your Prize",
    description: "If you win, receive instructions on how to claim your prize.",
  },
];

export default function ParticipationSteps() {
  return (
    <section className="px-6 md:px-16 pt-20 pb-10 bg-[#f9f9f9] text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Your Key to a New Home - Here's How
      </h2>
      <p className="text-gray-500 max-w-xl mx-auto mb-10">
        From sign-up to keys-in-hand, winning a home or rent relief is just a
        few steps away.
      </p>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="border border-[var(--primary-red)] rounded-xl bg-[#fff7f7] p-6"
          >
            <div className="flex flex-col items-start gap-3 mb-4">
              <div className="border border-[var(--primary-red)] bg-[var(--primary-red)]/15 text-[var(--primary-red)] p-2 rounded-md">
                <IconUser size={28} />
              </div>
              <h3 className="text-[var(--primary-red)] font-semibold text-xl">
                {step.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
