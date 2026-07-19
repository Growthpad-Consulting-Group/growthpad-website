import LogoGrid from "@/components/LogoGrid";
import { affiliations } from "@/data/affiliations";

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
