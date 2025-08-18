import { Container, Divider, Group, Text, Title } from "@mantine/core";
import SectionBanner from "../components/SectionBanner";
import { NavLink } from "react-router-dom";

const terms = [
  {
    heading: "Who We Are and How to Contact Us",
    content: `Our site is operated by Encore Windfall Limited (“We”). We are registered in Nigeria under company number RC1722157 and have our registered office at 26 Molade Okoya Street, Adeniyi Jones, Ikeja, Lagos.`,
  },
  {
    heading: "By Using Our Site, You Accept These Terms",
    content: `By using our site, you confirm that you accept these terms of use and that you agree to comply with them. If you do not agree to these terms, you must not use our site. We recommend that you print a copy of these terms for future reference.`,
  },
  {
    heading: "There are Other Terms That May Apply to You",
    content: (
      <>
        These terms of use refer to the following additional terms, which also
        apply to your use of our site:
        <br />
        <br />
        <ul className="text-base text-gray-700 space-y-2 list-disc list-inside pl-0">
          <li>
            Our Privacy Policy:{" "}
            <span className="!text-primary-red underline">
              <NavLink to={"/privacy-policy"}>
                www.windfallraffle.com/privacy-policy
              </NavLink>
            </span>{" "}
            which sets out the terms on which we process any personal data we
            collect from you, or that you provide to us. By using our site, you
            consent to such processing and you warrant that all data provided by
            you is accurate.
          </li>
          <br />
          <li>
            Our Acceptable Use Policy{" "}
            <span className="!text-primary-red underline">
              <NavLink to={"/privacy-policy"}>
                www.windfallraffle.com/acceptable-use-policy
              </NavLink>
            </span>
            , which sets out the permitted uses and prohibited uses of our site.
            When using our site, you must comply with this Acceptable Use
            Policy.
          </li>
          <br />
          <li>
            If you purchase goods or services from our site, participate in any
            promotions or enter any of our competitions, other terms and
            conditions will apply and which you must accept and abide by.{" "}
            <span className="!text-primary-red underline">
              <NavLink to={"/terms-and-conditions"}>
                www.windfallraffle.com/terms-and-conditions
              </NavLink>
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "We May Make Changes to These Terms",
    content: `We may amend these terms from time to time. Every time you wish to use our site, please check these terms to ensure you understand the terms that apply at that time.`,
  },
  {
    heading: "We May Make Changes to Our Site",
    content: `We may update and change our site from time to time to reflect changes to our products, our users’ needs, and our business priorities.`,
  },
  {
    heading: "We May Withdraw or Suspend Our Site",
    content: (
      <>
        Our site is made available free of charge but you may have to pay to
        enter our competitions.
        <br />
        <br />
        We do not guarantee that our site, or any content on it, will always be
        available or be uninterrupted. We may suspend or withdraw or restrict
        the availability of all or any part of our site for business and
        operational reasons. We will try to give you reasonable notice of any
        suspension or withdrawal.
        <br />
        <br />
        You are also responsible for ensuring that all persons who access our
        site through your internet connection are aware of these terms of use
        and other applicable terms and conditions, and that they comply with
        them.
      </>
    ),
  },
  {
    heading: "Who Can Use Our Site?",
    content: (
      <>
        <p className="!font-medium !text-lg !text-gray-800">
          Our site is only for users in Nigeria.
        </p>
        <br />
        <p>
          Our site is directed to people residing in the Nigeria. We do not
          represent that the content available on or through our site is
          appropriate for use or available in other locations.
        </p>
      </>
    ),
  },
  {
    heading: "You Must Keep Your Details Safe",
    content: (
      <>
        If you choose, or you are provided with, a user identification code,
        password or any other piece of information as part of our security
        procedures, you must treat such information as confidential. You must
        not disclose it to any third party.
        <br />
        <br />
        We have the right to disable any user identification code or password,
        whether chosen by you or allocated by us, at any time, if in our
        reasonable opinion you have failed to comply with any of the provisions
        of these terms of use.
        <br />
        <br />
        If you know or suspect that anyone other than you knows your user
        identification code or password, you must promptly notify us at{" "}
        <span className="text-primary-red underline">
          <a href="mailto:contact@homewindfall.com" className="hover:underline">
            contact@homewindfall.com
          </a>
        </span>
      </>
    ),
  },
  {
    heading: "How You May Use Material on Our Site",
    content: `We are the owner or the licensee of all intellectual property rights in our site and in the material published on it. Those works are protected by copyright laws and treaties around the world. All such rights are reserved.

                    You may print off one copy, and may download extracts, of any page(s) from our site for your personal use and you may draw the attention of others to content posted on our site.

                    You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text.

                    Our status (and that of any identified contributors) as the authors of content on our site must always be acknowledged.

                    You must not use any part of the content on our site for commercial purposes without obtaining a licence to do so from us or our licensors.

                    If you print off, copy or download any part of our site in breach of these terms of use, your right to use our site will cease immediately and you must, at our option, return or destroy any copies of the materials you have made.
                `,
  },
  {
    heading: "Do Not Rely On Information On This Site",
    content: `The content on our site is provided for general information only. It is not intended to amount to advice on which you should rely. You must obtain professional or specialist advice before taking, or refraining from, any action on the basis of the content on our site.

                    Although we make reasonable efforts to update the information on our site, we make no representations, warranties or guarantees, whether express or implied, that the content on our site is accurate, complete or up to date.
                `,
  },
  {
    heading: "We Are Not Responsible For Websites We Link To",
    content: `Where our site contains links to other sites and resources provided by third parties, these links are provided for your information only. Such links should not be interpreted as approval by us of those linked websites or information you may obtain from them.

                We have no control over the contents of those sites or resources.`,
  },
  {
    heading: "User-Generated Content is Not Approved by Us",
    content: (
      <>
        This website may include information and materials uploaded by other
        users of the site. This information and these materials have not been
        verified or approved by us. The views expressed by other users on our
        site do not represent our views or values.
        <br />
        <br />
        If you wish to complain about information and materials uploaded by
        other users please contact us at:{" "}
        <span className="text-primary-red underline">
          <a href="mailto:contact@homewindfall.com" className="hover:underline">
            contact@homewindfall.com
          </a>
        </span>
      </>
    ),
  },
  {
    heading: "Information About Use of Our Cookies",
    content: (
      <>
        Our website uses cookies to distinguish you from other users of our
        website. This helps us to provide you with a good experience when you
        browse our website and also allows us to improve our site.
        <br />
        <br />
        By continuing to browse the site, you are agreeing to our use of
        cookies.
        <br />
        <br />
        A cookie is a small file of letters and numbers that we store on your
        browser or the hard drive of your computer if you agree. Cookies contain
        information that is transferred to your computer's hard drive.
        <br />
        <br />
        We use the following cookies
        <br />
        <br />
        <ul className="text-base text-gray-700 space-y-2 list-disc list-inside pl-0">
          <li>
            <span className="!text-dark text-lg font-medium">
              Strictly Necessary Cookies.{" "}
            </span>
            These are cookies that are required for the operation of our
            website. They include, for example, cookies that enable you to log
            into secure areas of our website, use a shopping cart or make use of
            e-billing services.
          </li>
          <br />
          <li>
            <span className="!text-dark text-lg font-medium">
              Analytical/Performance Cookies.{" "}
            </span>
            They allow us to recognise and count the number of visitors and to
            see how visitors move around our website when they are using it.
            This helps us to improve the way our website works, for example, by
            ensuring that users are finding what they are looking for easily.
          </li>
          <br />
          <li>
            <span className="!text-dark text-lg font-medium">
              Functionality Cookies.{" "}
            </span>
            These are used to recognise you when you return to our website. This
            enables us to personalise our content for you, greet you by name and
            remember your preferences (for example, your choice of language or
            region).
          </li>
          <br />
          <li>
            <span className="!text-dark text-lg font-medium">
              Targeting Cookies.{" "}
            </span>
            These cookies record your visit to our website, the pages you have
            visited and the links you have followed. We will use this
            information to make our website and the advertising displayed on it
            more relevant to your interests. We may also share this information
            with third parties for this purpose.
          </li>
        </ul>
        <br />
        Please note that third parties (including, for example, advertising
        networks and providers of external services like web traffic analysis
        services) may also use cookies, over which we have no control. These
        cookies are likely to be analytical/performance cookies or targeting
        cookies.
        <br />
        <br />
        You can block cookies by activating the setting on your browser that
        allows you to refuse the setting of all or some cookies. However, if you
        use your browser settings to block all cookies (including essential
        cookies) you may not be able to access all or parts of our site.
      </>
    ),
  },
  {
    heading: "Our Responsibility For Loss or Damage Suffered by You",
    content: (
      <>
        <ul className="text-base text-gray-700 space-y-2 list-disc list-inside pl-0">
          <li>
            We do not exclude or limit in any way our liability to you where it
            would be unlawful to do so. This includes liability for death or
            personal injury caused by our negligence or the negligence of our
            employees, agents or subcontractors and for fraud or fraudulent
            misrepresentation.
          </li>
          <br />
          <li>
            Different limitations and exclusions of liability will apply to
            liability arising as a result of the supply of any products or
            services to you or if you enter our competitions, which will be set
            out in our Terms and Conditions.{" "}
            <span className="!text-primary-red underline">
              <NavLink to={"/terms-and-conditions"}>
                www.windfallraffle.com/terms-and-conditions
              </NavLink>
            </span>
          </li>
          <br />
          <li>
            Please note that we only provide our site for domestic and private
            use. You agree not to use our site for any commercial or business
            purposes, and we have no liability to you for any loss of profit,
            loss of business, business interruption, or loss of business
            opportunity.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Uploading Content to Our Site",
    content: (
      <>
        Whenever you make use of a feature that allows you to upload content to
        our site, post to our social media accounts or to make contact with
        other users of our site, you must comply with the content standards set
        out in our Acceptable Use Policy{" "}
        <span className="!text-primary-red underline">
          <NavLink to={"/privacy-policy"}>
            www.windfallraffle.com/acceptable-use-policy
          </NavLink>
        </span>
        <br />
        <br />
        You warrant that any such contribution does comply with those standards,
        and you will be liable to us and indemnify us for any breach of that
        warranty. This means you will be responsible for any loss or damage we
        suffer as a result of your breach of warranty.
        <br />
        <br />
        Any content you upload to our site will be considered non-confidential
        and non-proprietary. You retain all of your ownership rights in your
        content, but you are required to grant us a limited licence to use,
        store and copy that content and to distribute and make it available to
        third parties. The rights you license to us are described below.
        <br />
        <br />
        We also have the right to disclose your identity to any third party who
        is claiming that any content posted or uploaded by you to our site
        constitutes a violation of their intellectual property rights, or of
        their right to privacy.
        <br />
        <br />
        We have the right to remove any posting you make on our site if, in our
        opinion, your post does not comply with the content standards set out in
        our Acceptable Use Policy{" "}
        <span className="!text-primary-red underline">
          <NavLink to={"/privacy-policy"}>
            www.windfallraffle.com/acceptable-use-policy
          </NavLink>
        </span>
        <br />
        <br />
        You are solely responsible for securing and backing up your content.
      </>
    ),
  },
  {
    heading: "Rights You Are Giving Us to The Content You Upload",
    content: `When you upload or post content to our site, you grant us a perpetual, worldwide, non-exclusive, royalty-free, transferable licence to use, reproduce, distribute, prepare derivative works of, display, and perform that user-generated content. We may also share it, quote from it and use it to promote our site, products and services, particularly via social media.
                `,
  },
  {
    heading:
      "We Are Not Responsible For Viruses and You Must Not Introduce Them",
    content: `We do not guarantee that our site will be secure or free from bugs or viruses.

                    You are responsible for configuring your information technology, computer programmes and platform to access our site. You should use your own virus protection software.

                    You must not misuse our site by knowingly introducing viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful. You must not attempt to gain unauthorised access to our site, the server on which our site is stored or any server, computer or database connected to our site. You must not attack our site via a denial-of-service attack or a distributed denial-of service attack. By breaching this provision, you would commit a criminal offence under The Cybercrime (Prohibition, Prevention, Etc) Act, 2015 . We will report any such breach to the relevant law enforcement authorities and we will co-operate with those authorities by disclosing your identity to them. In the event of such a breach, your right to use our site will cease immediately.
                `,
  },
  {
    heading: "Rules About Linking To Our Site",
    content: (
      <>
        You may link to our home page, provided you do so in a way that is fair
        and legal and does not damage our reputation or take advantage of it.
        <br />
        <br />
        You must not establish a link in such a way as to suggest any form of
        association, approval or endorsement on our part where none exists.
        <br />
        <br />
        You must not establish a link to our site in any website that is not
        owned by you.
        <br />
        <br />
        Our site must not be framed on any other site, nor may you create a link
        to any part of our site other than the home page.
        <br />
        <br />
        We reserve the right to withdraw linking permission without notice.
        <br />
        <br />
        The website in which you are linking must comply in all respects with
        the content standards set out in our Acceptable Use Policy{" "}
        <span className="!text-primary-red underline">
          <NavLink to={"/privacy-policy"}>
            www.windfallraffle.com/acceptable-use-policy
          </NavLink>
        </span>
        <br />
        <br />
        If you wish to link to or make any use of content on our site other than
        that set out above, please contact{" "}
        <span className="text-primary-red underline">
          <a href="mailto:contact@homewindfall.com" className="hover:underline">
            contact@homewindfall.com
          </a>
        </span>
      </>
    ),
  },
  {
    heading: "Which Country's Laws Apply to Any Disputes?",
    content: `These terms of use, their subject matter and their formation, are governed by English law. You and we both agree that the law of Federal Republic of Nigeria will have exclusive jurisdiction to deal with any disputes between us.
                `,
  },
];

export default function TermsOfUse() {
  return (
    <section className="bg-white">
      <SectionBanner>
        <Group align="center" gap="lg" className="flex-wrap !gap-10">
          <Title order={2} className="text-black mb-10">
            Our Terms of Use Policy
          </Title>
          <Text className="text-base !text-gray-800 md:!w-[40vw]">
            Please read these terms & conditions carefully before using this
            site. These terms tell you the rules for using our website{" "}
            <span className="!text-primary-red">
              <NavLink to="/dashboard">www.windfallraffle.com</NavLink>
            </span>
          </Text>
        </Group>
      </SectionBanner>

      <Container fluid className="!pt-8 !pb-16 !px-6 md:!px-16 sm:!mx-5">
        {terms.map(({ heading, content }, i) => (
          <div key={i} className="grid md:grid-cols-12 gap-6 md:gap-y-0">
            <div className="col-span-12 md:col-span-5">
              <Text className="!font-medium !text-xl !text-gray-800">
                {heading}
              </Text>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className="!text-base !text-gray-700 !leading-relaxed !whitespace-pre-line">
                {content}
              </div>
            </div>
            {i < terms.length - 1 && <Divider className="col-span-12 !my-6" />}
          </div>
        ))}
      </Container>
    </section>
  );
}
