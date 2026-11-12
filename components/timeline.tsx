import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ExpandableItem } from "@/components/timeline-item";
import { EXPERIENCES, experiencePeriod, type Experience } from "@/lib/experience-data";

const CompanyLogo = ({ experience }: { experience: Experience }) => {
  const { company, logo, logoDark, logoWidth = 48, logoHeight = 48, href } = experience;
  const className = "size-12 max-md:size-10 rounded-lg border border-line bg-surface-raised p-1.5 object-contain";

  const images = (
    <>
      <Image
        src={logo}
        alt={company}
        width={logoWidth}
        height={logoHeight}
        className={logoDark ? `${className} dark:hidden` : className}
      />
      {logoDark && (
        <Image
          src={logoDark}
          alt={company}
          width={logoWidth}
          height={logoHeight}
          className={`${className} hidden dark:block`}
        />
      )}
    </>
  );

  if (!href) return images;

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
      {images}
    </Link>
  );
};

export const Timeline = () => {
  return (
    <div className="mb-6">
      <div className="flex flex-col divide-y divide-dashed divide-line">
        {EXPERIENCES.map((exp) => (
          <ExpandableItem
            key={exp.company}
            tech={exp.tech}
            scope={exp.company}
            header={
              <>
                <div className="relative shrink-0 mt-1 max-md:mt-0 z-10">
                  <CompanyLogo experience={exp} />
                </div>

                <div className="flex flex-col md:flex-row md:justify-between flex-1 gap-2 md:gap-4 max-md:gap-0.5 max-md:pr-9 min-w-0">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-custom text-lg font-bold tracking-wide text-fg max-md:text-base">
                      {exp.company}
                    </h3>
                    <p className="text-sm font-medium text-fg-muted font-custom2">
                      {exp.designation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-1 md:mt-0 max-md:mt-0">
                    <div className="flex flex-col gap-0.5 md:items-end md:gap-1">
                      <span className="font-custom2 text-sm whitespace-nowrap text-fg-subtle">
                        {experiencePeriod(exp)}
                      </span>
                      <span className="font-custom2 text-xs whitespace-nowrap text-fg-subtle">
                        {exp.location}
                      </span>
                    </div>
                    <div className="max-md:absolute max-md:right-0 max-md:top-1/2 max-md:-translate-y-1/2 max-md:grid max-md:place-items-center max-md:size-11 p-1 text-fg-faint group-hover/row:text-fg transition-[color,rotate] duration-200 group-aria-expanded/row:rotate-180">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </>
            }
          >
            <ul className="space-y-2 text-sm text-fg-body font-custom2 leading-relaxed">
                {exp.highlights.map((point) => (
                  <li
                    key={point}
                    className="relative pl-4 before:absolute before:left-0 before:content-['-'] before:text-fg-faint"
                    dangerouslySetInnerHTML={{ __html: point }}
                  />
                ))}
            </ul>
          </ExpandableItem>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
