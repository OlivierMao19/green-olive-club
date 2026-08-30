import { useEffect, useState } from "react";
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
import { Search, ArrowUpDown } from "lucide-react";

interface AttendeeTableProps {
  eventId: string;
}

interface Attendee {
  id: string;
  email: string;
  name: string;
  mcgillId: string;
  registrationDate: Date;
  isGuest: boolean;
}

export default function AttendeeTable({ eventId }: AttendeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Attendee;
    direction: "ascending" | "descending";
  } | null>(null);

  const [eventAttendees, setEventAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(`/api/attendees?eventId=${eventId}`, {
          method: "GET",
        });
        const data = await response.json();
        const eventAttendees = data.map((attendee: {
          id: string;
          email: string;
          name: string;
          mcgillId: string;
          registrationDate: string;
          isGuest: boolean;
        }) => ({
          id: attendee.id,
          email: attendee.email,
          name: attendee.name,
          mcgillId: attendee.mcgillId,
          registrationDate: new Date(attendee.registrationDate),
          isGuest: attendee.isGuest,
        }));
        setEventAttendees(eventAttendees);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };
    fetchAttendees();
  }, [eventId]);

  // Filter based on search term
  const filteredAttendees = eventAttendees.filter((attendee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(searchLower) ||
      attendee.email.toLowerCase().includes(searchLower) ||
      attendee.mcgillId.toLowerCase().includes(searchLower)
    );
  });

  // Sort attendees
  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    // Get values to compare based on key
    const valueA = a[key];
    const valueB = b[key];

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

    // Handle boolean, number comparison
    if (valueA < valueB) {
      return direction === "ascending" ? -1 : 1;
    }
    if (valueA > valueB) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Attendee) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full animate-scale-in">
      <div className="flex items-center mb-4">
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
      </div>

      {sortedAttendees.length > 0 ? (
        <div className="max-h-[min(24rem,50vh)] overflow-auto overscroll-contain rounded-md border">
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
                    mcGill Id
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>

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
                    {attendee.mcgillId}
                  </TableCell>

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
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">No attendees found</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        {filteredAttendees.length} attendee
        {filteredAttendees.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}
