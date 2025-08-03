import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManualEntrySectionProps {
  reportType: string;
  entries: any[];
  onEntriesChange: (entries: any[]) => void;
}

const ManualEntrySection = ({ reportType, entries, onEntriesChange }: ManualEntrySectionProps) => {
  const [currentEntry, setCurrentEntry] = useState({
    studentName: "",
    rollNumber: "",
    details: "",
    remarks: "",
  });
  const { toast } = useToast();

  const addEntry = () => {
    if (!currentEntry.studentName || !currentEntry.rollNumber) {
      toast({
        title: "Error",
        description: "Please fill student name and roll number",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      ...currentEntry,
      id: Date.now(),
    };

    onEntriesChange([...entries, newEntry]);
    setCurrentEntry({
      studentName: "",
      rollNumber: "",
      details: "",
      remarks: "",
    });

    toast({
      title: "Success",
      description: "Student entry added successfully!",
    });
  };

  const removeEntry = (id: number) => {
    onEntriesChange(entries.filter(entry => entry.id !== id));
  };

  const getFieldLabel = () => {
    switch (reportType) {
      case "student-participation":
        return "Participation Details";
      case "student-achievement":
        return "Achievement Details";
      case "call-record":
        return "Call Details";
      case "issue-raised":
        return "Issue Description";
      case "student-complete":
        return "Complete Details";
      case "subject-attendance":
        return "Attendance Details";
      case "subject-marks":
        return "Marks Details";
      default:
        return "Details";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Manual Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Entry Form */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium">Add New Student Entry</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                placeholder="Enter student name"
                value={currentEntry.studentName}
                onChange={(e) => setCurrentEntry({ ...currentEntry, studentName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                placeholder="Enter roll number"
                value={currentEntry.rollNumber}
                onChange={(e) => setCurrentEntry({ ...currentEntry, rollNumber: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">{getFieldLabel()}</Label>
            <Textarea
              id="details"
              placeholder={`Enter ${getFieldLabel().toLowerCase()}`}
              value={currentEntry.details}
              onChange={(e) => setCurrentEntry({ ...currentEntry, details: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Input
              id="remarks"
              placeholder="Enter remarks"
              value={currentEntry.remarks}
              onChange={(e) => setCurrentEntry({ ...currentEntry, remarks: e.target.value })}
            />
          </div>
          
          <Button onClick={addEntry} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Added Entries ({entries.length})</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="flex-1">
                    <p className="font-medium">{entry.studentName}</p>
                    <p className="text-sm text-muted-foreground">Roll: {entry.rollNumber}</p>
                    {entry.details && (
                      <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualEntrySection;