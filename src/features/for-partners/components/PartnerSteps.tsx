import DiagonalSteps from "@/shared/components/DiagonalSteps";

const steps = [
  {
    title: "",
    body: "Recommend our services to other companies/businesses – as many as you'd like, there's no limit!",
  },
  {
    title: "",
    body: "We'll discuss with them to see if Growthpad is the right fit for their needs.",
  },
  {
    title: "",
    body: "Receive a partner package when your partner signs up. For larger projects, we'll offer you an enhanced incentive package.",
  },
];

export default function PartnerSteps() {
  return <DiagonalSteps heading="How Does it Work?" steps={steps} theme="light" />;
}
