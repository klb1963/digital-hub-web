// src/app/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy – leonidk.de",
};

export default function PrivacyPage() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-4xl px-4 py-10 text-neutral-200">
        <h1 className="text-3xl font-semibold text-neutral-100">
          Privacy Policy
        </h1>

        <div className="mt-6 space-y-4">
          <p>
            This website uses cookies for analytics to understand traffic and improve the content.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-neutral-100">
            Google Analytics
          </h2>
          <p>
            We use Google Analytics (GA4) to measure website usage (e.g. page views,
            approximate location, device type). Analytics is loaded only after you
            accept cookies in the consent banner.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-neutral-100">
            Your choice
          </h2>
          <p>
            You can accept or reject analytics cookies via the banner.
            If you reject, Google Analytics will not load.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-neutral-100">
            Contact
          </h2>
          <p>
            If you have questions about privacy, contact me via the contact page.
          </p>
        </div>
      </div>
    </div>
  );
}