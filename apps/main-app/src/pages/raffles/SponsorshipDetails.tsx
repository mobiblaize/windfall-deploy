export default function SponsorshipDetails({ details }: {details: string}) {
  return (
    <div className="space-y-6 text-gray-800 text-base leading-relaxed bg-white rounded-xl px-10 py-8 shadow-sm" dangerouslySetInnerHTML={{ __html: details }}>
      {/* <div>
        <p className="font-semibold text-black">📄 Sponsorship Details for This Game</p>
        <p>
          This raffle is proudly sponsored by [Insert Sponsor Name(s)], who have made it possible
          for one lucky participant to win a luxury studio apartment in Lekki, Lagos.
        </p>
      </div>

      <div>
        <p className="font-semibold text-black">Sponsor Contribution:</p>
        <ul className="list-decimal pl-6 space-y-1">
          <li>Fully funded the apartment unit including furnishing and legal transfer</li>
          <li>Supported logistics for the raffle operations and winner verification</li>
          <li>
            Co-branded marketing across digital platforms, print, and live draw event
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold text-black">Why It Matters:</p>
        <p>
          All promotions, ticket sales pages, and winner announcements will feature the sponsor's
          logo and brand message, recognising their role in transforming one player’s future.
        </p>
      </div>

      <div>
        <p className="font-semibold text-black">Sponsor Acknowledgment:</p>
        <p>Sponsor Acknowledgment:</p>
      </div> */}
    </div>
  );
}
