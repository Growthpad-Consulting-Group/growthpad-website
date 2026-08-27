"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const POOL = [
  "deloitte.png",
  "pwc.png",
  "uber.png",
  "kenya-airways.png",
  "usaid.png",
  "ukaid.png",
  "ecobank.png",
  "zoho.png",
  "oxfam.png",
  "sidian.png",
  "hpe.png",
  "asus.png",
  "sbi.png",
  "buhler.png",
  "iucn.png",
  "kmrc.png",
  "mayfair.png",
  "pigeon.png",
  "Sunculture.png",
  "fsd.png",
  "zenka.png",
  "greenhearts.png",
  "ifaw.png",
  "ifrc.png",
  "scienceforafrica.png",
  "sga.png",
  "elaraby.png",
  "taiwan.png",
  "unhcr.png",
];

const DESKTOP_COUNT = 6;
const MOBILE_COUNT = 6;
const MOBILE_MQ = "(max-width: 767px)";
const EXIT_MS = 700;
const ENTER_MS = 700;
const STAGGER_MS = 180;
const GROUP_INTERVAL_MS = 6000;
const INITIAL_DELAY_MS = 2000;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type LogoItem = {
  file: string;
  group: number;
  order: number;
  initiallyVisible: boolean;
};

type SlotPhase = "idle" | "exit" | "enter";

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    while (slice.length < size) {
      slice.push(items[slice.length % items.length]);
    }
    groups.push(slice);
  }
  return groups;
}

function buildLogoItems(count: number): LogoItem[] {
  const groups = chunk(POOL, count);
  const items: LogoItem[] = [];

  groups.forEach((group, groupIndex) => {
    group.forEach((file, orderIndex) => {
      items.push({
        file,
        group: groupIndex + 1,
        order: orderIndex + 1,
        initiallyVisible: groupIndex === 0,
      });
    });
  });

  return items;
}

const DESKTOP_ITEMS = buildLogoItems(DESKTOP_COUNT);
const MOBILE_ITEMS = buildLogoItems(MOBILE_COUNT);

function buildGroups(items: LogoItem[]) {
  const groups: Record<number, string[]> = {};

  items.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group][item.order - 1] = item.file;
  });

  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)
    .map((key) => groups[key]);
}

function LogoWrap({ file, phase }: { file: string; phase: SlotPhase }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const transition = `transform ${ENTER_MS}ms ${EASE}, opacity ${ENTER_MS}ms ${EASE}`;

    if (phase === "exit") {
      el.style.transition = transition;
      el.style.opacity = "0";
      el.style.transform = "translate3d(24px, 0, 0)";
      return;
    }

    if (phase === "enter") {
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translate3d(-24px, 0, 0)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = transition;
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0, 0)";
        });
      });
      return;
    }

    el.style.transition = transition;
    el.style.opacity = "1";
    el.style.transform = "translate3d(0, 0, 0)";
  }, [phase, file]);

  return (
    <div className="logo-wrap flex h-full w-full items-center justify-center overflow-clip">
      <div
        ref={innerRef}
        className="relative flex h-full w-full items-center justify-center will-change-[transform,opacity]"
      >
        <Image
          src={`/assets/images/clients/${file}`}
          alt=""
          fill
          sizes="200px"
          className="home-logo object-contain"
        />
      </div>
    </div>
  );
}

export default function LogoShowcase() {
  const [isMobile, setIsMobile] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const [slotLogos, setSlotLogos] = useState<string[]>(() =>
    buildGroups(DESKTOP_ITEMS)[0],
  );
  const [slotPhases, setSlotPhases] = useState<SlotPhase[]>(() =>
    Array(DESKTOP_COUNT).fill("idle"),
  );
  const groupIndexRef = useRef(0);
  const isMobileRef = useRef(false);

  const visibleCount = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
  const allItems = isMobile ? MOBILE_ITEMS : DESKTOP_ITEMS;
  const groups = useMemo(() => buildGroups(allItems), [allItems]);

  const resetToGroup = useCallback(
    (index: number, count: number, groupList: string[][]) => {
      groupIndexRef.current = index;
      setGroupIndex(index);
      setSlotLogos(groupList[index] ?? groupList[0]);
      setSlotPhases(Array(count).fill("idle"));
    },
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const apply = () => {
      const mobile = mq.matches;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
      const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT;
      const groupList = buildGroups(mobile ? MOBILE_ITEMS : DESKTOP_ITEMS);
      resetToGroup(0, count, groupList);
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [resetToGroup]);

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>();

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeouts.add(id);
      return id;
    };

    const showNextGroup = () => {
      const mobile = isMobileRef.current;
      const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT;
      const groupList = buildGroups(mobile ? MOBILE_ITEMS : DESKTOP_ITEMS);
      const nextIndex = (groupIndexRef.current + 1) % groupList.length;
      const nextGroup = groupList[nextIndex];

      for (let i = 0; i < count; i++) {
        schedule(() => {
          setSlotPhases((prev) => {
            const next = [...prev];
            next[i] = "exit";
            return next;
          });

          schedule(() => {
            setSlotLogos((prev) => {
              const next = [...prev];
              next[i] = nextGroup[i];
              return next;
            });
            setSlotPhases((prev) => {
              const next = [...prev];
              next[i] = "enter";
              return next;
            });

            schedule(() => {
              setSlotPhases((prev) => {
                const next = [...prev];
                next[i] = "idle";
                return next;
              });
            }, ENTER_MS);
          }, EXIT_MS);
        }, i * STAGGER_MS);
      }

      groupIndexRef.current = nextIndex;
      setGroupIndex(nextIndex);
      schedule(showNextGroup, GROUP_INTERVAL_MS);
    };

    schedule(showNextGroup, INITIAL_DELAY_MS);

    return () => timeouts.forEach(clearTimeout);
  }, [isMobile]);

  return (
    <div
      role="list"
      className="w-full gap-0 grid w-full overflow-clip max-h-[12.75rem] sm:max-h-[6.375rem] grid-cols-3 sm:grid-cols-6"
      data-anime-logo-count={DESKTOP_COUNT}
      data-anime-logo-count-mobile={MOBILE_COUNT}
      data-logo-stagger-count={visibleCount}
    >
      {slotLogos.slice(0, visibleCount).map((file, index) => (
        <div
          key={`slot-${index}`}
          role="listitem"
          className="home-logos-wrap flex h-[6.375rem] w-full items-center justify-center overflow-clip"
          style={{ display: "block" }}
          data-logo-group={groupIndex + 1}
          data-logo-order={index + 1}
          data-initially-visible={groupIndex === 0 ? "True" : "False"}
        >
          <LogoWrap file={file} phase={slotPhases[index] ?? "idle"} />
        </div>
      ))}
    </div>
  );
}
