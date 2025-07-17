import { IconCalendar } from "@tabler/icons-react";

export default function CompetitionDetails() {
  return (
    <div className="space-y-6 text-gray-800 text-lg leading-relaxed bg-white rounded-xl px-10 py-8 rounded-b-xl shadow-sm">
      <div>
        <p className="font-semibold text-black">🎮 Game Details:</p>
        <p>
          A fully finished luxury studio apartment located in the heart of Lekki, Lagos — complete with modern fittings, 24/7 power, and secure gated access.
        </p>
      </div>

      <div>
        <p className="font-semibold text-black">🎟️ Ticket Price:</p>
        <p>₦5,000 per entry</p>
      </div>

      <div>
        <p className="font-semibold text-black flex gap-1 items-center"><IconCalendar /> <span>Raffle Deadline:</span></p>
        <p>Entries close on June 1st 2025 at 11:59 PM (WAT)</p>
      </div>

      <div>
        <p className="font-semibold text-black">🚀 Prize to be Won</p>
        <p>
          Win a stunning, fully finished luxury home in the prestigious neighbourhood of Lekki, Lagos. This exquisite property features premium fittings, elegant design, ample space, and top-notch finishing. Nestled in a serene, secure environment with easy access to key landmarks, it’s more than just a home — it’s a lifestyle upgrade. All it takes is one raffle ticket to make this dream your reality.
        </p>
      </div>

      <div>
        <p className="font-semibold text-black">📣 Winner Announcement:</p>
        <p>Live draw on June 2nd via Instagram and on our official website</p>
      </div>

      <div>
        <p className="font-semibold text-black">📝 How to Enter:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Select and enter the raffles from the categories</li>
          <li>Register or log into your Windfall account</li>
          <li>Purchase as many tickets as you would like</li>
          <li>Get instant confirmation via email or SMS</li>
          <li>Wait for the live draw date and stay tuned for your chance to win big</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold text-black">📋 Eligibility:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Must be 18 years or older</li>
          <li>Open to residents of Nigeria</li>
          <li>Valid government-issued ID required to claim prize</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold text-black">🔔 Notifications:</p>
        <p>All participants will receive updates and results via email and SMS.</p>
      </div>
    </div>
  );
}
