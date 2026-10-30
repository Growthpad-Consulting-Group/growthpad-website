export type KaziJob = {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string | null;
  requirements: { must_haves: string[]; nice_to_haves: string[] };
  employment_type: string | null;
  work_mode: string | null;
  contract_duration: string | null;
  compensation: string | null;
  reports_to: string | null;
  benefits: string | null;
  application_instructions: string | null;
  selection_process: string | null;
  published_at: string | null;
  closes_at: string | null;
};

const KAZI_API_URL =
  process.env.KAZI_API_URL ?? "https://kazi.growthpad.africa";
const REVALIDATE_SECONDS = 300;

export async function getKaziJobs(): Promise<KaziJob[]> {
  try {
    const res = await fetch(`${KAZI_API_URL}/api/public/jobs`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["kaziJobs"] },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { jobs: KaziJob[] };
    return json.jobs;
  } catch {
    return [];
  }
}

export async function getKaziJob(slug: string): Promise<KaziJob | null> {
  try {
    const res = await fetch(
      `${KAZI_API_URL}/api/public/jobs/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
          tags: ["kaziJobs", `kaziJob:${slug}`],
        },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { job: KaziJob };
    return json.job;
  } catch {
    return null;
  }
}
