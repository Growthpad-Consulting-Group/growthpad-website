import LogoGrid from "@/features/home/components/LogoGrid";
import { affiliations } from "@/features/home/data/affiliations";

export default function Affiliations() {
  return (
    <LogoGrid
      theme="gray"
      heading="Some of our partners"
      items={affiliations.map((affiliation) => ({
        name: affiliation.name,
        src: `/assets/images/partners/${affiliation.logo}`,
      }))}
    />
  );
}
