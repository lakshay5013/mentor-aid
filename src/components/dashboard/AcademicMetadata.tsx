import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

interface AcademicMetadataProps {
  data: {
    program: string;
    batch: string;
    academicYear: string;
    group: string;
    session: string;
    semester: string;
  };
  onChange: (data: any) => void;
}

const AcademicMetadata = ({ data, onChange }: AcademicMetadataProps) => {
  const updateField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Academic Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fixed Fields */}
        <div className="space-y-2">
          <Label>Department</Label>
          <div className="px-3 py-2 bg-muted rounded-md text-sm">
            Department of Computer Science and Engineering
          </div>
        </div>

        <div className="space-y-2">
          <Label>Institution</Label>
          <div className="px-3 py-2 bg-muted rounded-md text-sm">
            Chitkara University Institute of Engineering & Technology
          </div>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-2">
          <Label>Program</Label>
          <Select value={data.program} onValueChange={(value) => updateField("program", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="be-cse-ai">B.E. CSE (AI)</SelectItem>
              <SelectItem value="be-cse-ml">B.E. CSE (ML)</SelectItem>
              <SelectItem value="be-cse-general">B.E. CSE (General)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Batch</Label>
          <Select value={data.batch} onValueChange={(value) => updateField("batch", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Academic Year</Label>
          <Select value={data.academicYear} onValueChange={(value) => updateField("academicYear", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022-2023">2022–2023</SelectItem>
              <SelectItem value="2023-2024">2023–2024</SelectItem>
              <SelectItem value="2024-2025">2024–2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Group</Label>
          <Select value={data.group} onValueChange={(value) => updateField("group", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4A">4A</SelectItem>
              <SelectItem value="4B">4B</SelectItem>
              <SelectItem value="4C">4C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Session</Label>
          <Select value={data.session} onValueChange={(value) => updateField("session", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan-june-2024">Jan–June 2024</SelectItem>
              <SelectItem value="july-dec-2024">July–Dec 2024</SelectItem>
              <SelectItem value="jan-june-2025">Jan–June 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={data.semester} onValueChange={(value) => updateField("semester", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => (
                <SelectItem key={i + 1} value={`${i + 1}`}>
                  {i + 1}st Semester
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicMetadata;