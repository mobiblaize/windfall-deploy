import { useState } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question: 'Who is eligible to participate?',
    answer:
      'Anyone aged 18 years or older, currently residing in Nigeria, is eligible to enter the raffle.',
  },
  {
    question: 'How will the winner be selected?',
    answer:
      'The winner will be randomly selected using a verified electronic draw system in the presence of independent observers.',
  },
  {
    question: 'What happens if I win?',
    answer:
      'You will be contacted by our team and guided through the process of claiming your prize, including documentation and key handover.',
  },
  {
    question: 'Is the apartment fully owned by the winner?',
    answer:
      'Yes, the winner will receive full legal ownership of the apartment without hidden costs.',
  },
  {
    question: 'How much is a raffle ticket for this game?',
    answer:
      'Each ticket costs ₦3,000. You can purchase multiple tickets to increase your chances of winning.',
  },
];

export default function RafflesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 text-lg">
      {faqData.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow border border-gray-200"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left"
              onClick={() => toggleItem(index)}
            >
              <span className={`font-bold ${isOpen ? 'text-[#818181]': 'text-[#2d2d2d]'}`}>{faq.question}</span>
              <span className="border border-gray-300 rounded-full p-3 bg-white">
                {isOpen ? (
                    <IconChevronUp size={16} className="text-gray-500" />
                ) : (
                    <IconChevronDown size={16} className="text-gray-500" />
                )}
                </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-4 text-gray-800">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
