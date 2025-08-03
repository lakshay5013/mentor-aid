import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

interface ReportTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const reportTypes = [
  { value: "student-participation", label: "Student Participation Details" },
  { value: "student-achievement", label: "Student Achievement Detail" },
  { value: "call-record", label: "Call Record" },
  { value: "issue-raised", label: "Issue Raised" },
  { value: "student-complete", label: "Student Complete Detail" },
  { value: "subject-attendance", label: "Subject Wise Attendance" },
  { value: "subject-marks", label: "Subject Wise FA/ST Marks" },
];

const ReportTypeSelector = ({ selectedType, onTypeChange }: ReportTypeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Report Type</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ReportTypeSelector;