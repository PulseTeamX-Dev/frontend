import { privacyPolicySections } from "../data/privacyPolicy";
export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Privacy Policy
      </h1>

      <div className="space-y-8">
        {privacyPolicySections.map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-semibold mb-3">
              {section.title}
            </h2>

            <p className="whitespace-pre-line leading-8 text-gray-700">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
};