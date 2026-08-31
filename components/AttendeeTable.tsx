import { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowUpDown } from "lucide-react";
import type { CustomField } from "@/lib/customFields";

type AttendeeViewMode = "full" | "compact";

interface AttendeeTableProps {
  eventId: string;
}

interface Attendee {
  id: string;
  email: string;
  name: string;
  mcgillId: string;
  school: string;
  registrationDate: Date;
  isGuest: boolean;
  customAnswers: Record<string, string>;
}

type SortableKey = keyof Attendee | `custom:${string}`;

type CompactGridLayout = {
  columns: number;
  rows: number;
  fontSize: number;
  gap: number;
  padding: number;
  maxLines: number;
};

const COMPACT_LINE_HEIGHT = 1.2;
const COMPACT_CELL_PADDING = 4;

function estimateLineCount(
  name: string,
  cellWidth: number,
  fontSize: number
): number {
  const charWidth = fontSize * 0.52;
  const charsPerLine = Math.max(
    1,
    Math.floor((cellWidth - COMPACT_CELL_PADDING * 2) / charWidth)
  );

  return Math.max(1, Math.ceil(name.length / charsPerLine));
}

function maxLineCount(
  names: string[],
  cellWidth: number,
  fontSize: number
): number {
  return Math.max(
    1,
    ...names.map((name) => estimateLineCount(name, cellWidth, fontSize))
  );
}

function computeCompactGridLayout(
  names: string[],
  width: number,
  height: number
): CompactGridLayout {
  const count = names.length;
  const padding = 10;
  const minGap = 4;
  const idealGap = 6;
  const minFontSize = 10;
  const maxFontSize = 14;
  const minCellWidth = 64;

  if (count === 0 || width <= 0 || height <= 0) {
    return {
      columns: 2,
      rows: 1,
      fontSize: maxFontSize,
      gap: idealGap,
      padding,
      maxLines: 1,
    };
  }

  const maxColumns = Math.min(
    count,
    Math.max(2, Math.floor((width - padding * 2 + minGap) / (minCellWidth + minGap)))
  );

  let best: CompactGridLayout | null = null;

  for (let columns = 2; columns <= maxColumns; columns++) {
    const rows = Math.ceil(count / columns);
    const gap = count > 30 ? minGap : idealGap;
    const cellWidth = (width - padding * 2 - (columns - 1) * gap) / columns;
    const cellHeight = (height - padding * 2 - (rows - 1) * gap) / rows;

    if (cellWidth < minCellWidth || cellHeight < minFontSize * COMPACT_LINE_HEIGHT + COMPACT_CELL_PADDING * 2) {
      continue;
    }

    for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 0.5) {
      const linesNeeded = maxLineCount(names, cellWidth, fontSize);
      const maxLinesAllowed = Math.max(
        1,
        Math.floor(
          (cellHeight - COMPACT_CELL_PADDING * 2) / (fontSize * COMPACT_LINE_HEIGHT)
        )
      );

      if (linesNeeded > maxLinesAllowed) {
        continue;
      }

      const candidate: CompactGridLayout = {
        columns,
        rows,
        fontSize,
        gap,
        padding,
        maxLines: linesNeeded,
      };

      if (
        !best ||
        candidate.fontSize > best.fontSize ||
        (candidate.fontSize === best.fontSize &&
          candidate.maxLines < best.maxLines) ||
        (candidate.fontSize === best.fontSize &&
          candidate.maxLines === best.maxLines &&
          (count > 20
            ? candidate.columns > best.columns
            : candidate.columns < best.columns))
      ) {
        best = candidate;
      }

      break;
    }
  }

  if (!best) {
    const columns = maxColumns;
    const rows = Math.ceil(count / columns);
    const gap = minGap;
    const cellWidth = (width - padding * 2 - (columns - 1) * gap) / columns;
    const cellHeight = (height - padding * 2 - (rows - 1) * gap) / rows;
    const maxLinesAllowed = Math.max(
      1,
      Math.floor(
        (cellHeight - COMPACT_CELL_PADDING * 2) / (minFontSize * COMPACT_LINE_HEIGHT)
      )
    );
    const linesNeeded = Math.min(
      maxLinesAllowed,
      maxLineCount(names, cellWidth, minFontSize)
    );

    best = {
      columns,
      rows,
      fontSize: minFontSize,
      gap,
      padding,
      maxLines: Math.max(1, linesNeeded),
    };
  }

  return best;
}

function useElementSize<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize({ width, height });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [enabled]);

  return { ref, width: size.width, height: size.height };
}

export default function AttendeeTable({ eventId }: AttendeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<AttendeeViewMode>("full");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [eventAttendees, setEventAttendees] = useState<Attendee[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  useEffect(() => {
    if (!eventId) {
      setEventAttendees([]);
      setCustomFields([]);
      return;
    }

    const fetchAttendees = async () => {
      try {
        const response = await fetch(`/api/attendees?eventId=${eventId}`, {
          method: "GET",
        });
        const data = await response.json();
        if (!response.ok || !data || !Array.isArray(data.attendees)) {
          console.error("Error fetching attendees:", data);
          setEventAttendees([]);
          setCustomFields([]);
          return;
        }

        const attendees = data.attendees.map(
          (attendee: {
            id: string;
            email: string;
            name: string;
            mcgillId: string | null;
            school: string | null;
            registrationDate: string;
            isGuest: boolean;
            customAnswers?: Record<string, string>;
          }) => ({
            id: attendee.id,
            email: attendee.email,
            name: attendee.name,
            mcgillId: attendee.mcgillId ?? "",
            school: attendee.school ?? "",
            registrationDate: new Date(attendee.registrationDate),
            isGuest: attendee.isGuest,
            customAnswers: attendee.customAnswers ?? {},
          })
        );

        setEventAttendees(attendees);
        setCustomFields(Array.isArray(data.customFields) ? data.customFields : []);
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setEventAttendees([]);
        setCustomFields([]);
      }
    };
    fetchAttendees();
  }, [eventId]);

  const filteredAttendees = eventAttendees.filter((attendee) => {
    const searchLower = searchTerm.toLowerCase();
    const customAnswerValues = Object.values(attendee.customAnswers).join(" ");

    return (
      attendee.name.toLowerCase().includes(searchLower) ||
      attendee.email.toLowerCase().includes(searchLower) ||
      attendee.mcgillId.toLowerCase().includes(searchLower) ||
      attendee.school.toLowerCase().includes(searchLower) ||
      customAnswerValues.toLowerCase().includes(searchLower)
    );
  });

  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    let valueA: string | Date | boolean;
    let valueB: string | Date | boolean;

    if (key.startsWith("custom:")) {
      const fieldId = key.replace("custom:", "");
      valueA = a.customAnswers[fieldId] ?? "";
      valueB = b.customAnswers[fieldId] ?? "";
    } else {
      valueA = a[key as keyof Attendee] as string | Date | boolean;
      valueB = b[key as keyof Attendee] as string | Date | boolean;
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === "ascending"
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "ascending"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (valueA < valueB) {
      return direction === "ascending" ? -1 : 1;
    }
    if (valueA > valueB) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortableKey) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const { ref: compactGridRef, width: compactWidth, height: compactHeight } =
    useElementSize<HTMLDivElement>(viewMode === "compact");

  const attendeeNames = useMemo(
    () => sortedAttendees.map((attendee) => attendee.name),
    [sortedAttendees]
  );

  const compactLayout = useMemo(
    () => computeCompactGridLayout(attendeeNames, compactWidth, compactHeight),
    [attendeeNames, compactWidth, compactHeight]
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col animate-scale-in">
      <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as AttendeeViewMode)}
        >
          <TabsList className="h-9 w-full sm:w-auto">
            <TabsTrigger value="full" className="flex-1 sm:flex-none">
              Full
            </TabsTrigger>
            <TabsTrigger value="compact" className="flex-1 sm:flex-none">
              Compact
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {sortedAttendees.length > 0 ? (
        viewMode === "compact" ? (
          <div
            ref={compactGridRef}
            className="min-h-0 flex-1 overflow-hidden rounded-md border"
          >
            <ul
              className="grid h-full w-full"
              style={{
                gridTemplateColumns: `repeat(${compactLayout.columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${compactLayout.rows}, minmax(0, 1fr))`,
                gap: compactLayout.gap,
                padding: compactLayout.padding,
              }}
            >
              {sortedAttendees.map((attendee) => (
                <li
                  key={attendee.id}
                  className="flex min-h-0 items-center justify-center overflow-hidden rounded-md border border-emerald-100 bg-emerald-50/50 p-1 font-medium text-emerald-950"
                >
                  <span
                    className="w-full text-center leading-tight break-words hyphens-auto"
                    style={{
                      fontSize: compactLayout.fontSize,
                      display: "-webkit-box",
                      WebkitLineClamp: compactLayout.maxLines,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {attendee.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background [&_th]:bg-background">
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="hover:bg-transparent px-0"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("email")}
                    className="hover:bg-transparent px-0"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("mcgillId")}
                    className="hover:bg-transparent px-0"
                  >
                    Student ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("school")}
                    className="hover:bg-transparent px-0"
                  >
                    School
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

                {customFields.map((field) => (
                  <TableHead key={field.id} className="hidden lg:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(`custom:${field.id}`)}
                      className="hover:bg-transparent px-0"
                    >
                      {field.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}

                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("isGuest")}
                    className="hover:bg-transparent px-0"
                  >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("registrationDate")}
                    className="hover:bg-transparent px-0"
                  >
                    Registered At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedAttendees.map((attendee) => (
                <TableRow key={attendee.id} className="items-center">
                  <TableCell className="font-medium justify-between">
                    {attendee.name}
                  </TableCell>

                  <TableCell>{attendee.email}</TableCell>

                  <TableCell className="font-medium hidden md:table-cell">
                    {attendee.mcgillId || "—"}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {attendee.school || "—"}
                  </TableCell>

                  {customFields.map((field) => (
                    <TableCell key={field.id} className="hidden lg:table-cell">
                      {attendee.customAnswers[field.id] || "—"}
                    </TableCell>
                  ))}

                  <TableCell className="hidden md:table-cell">
                    {attendee.isGuest ? "Guest" : "Member"}
                  </TableCell>

                  <TableCell className="font-medium hidden md:table-cell justify-between">
                    {attendee.registrationDate.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">No attendees found</p>
        </div>
      )}

      <div className="mt-4 shrink-0 text-sm text-gray-500">
        {filteredAttendees.length} attendee
        {filteredAttendees.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}
