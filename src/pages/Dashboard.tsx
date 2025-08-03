import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, FileText, UserPlus } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReportTypeSelector from "@/components/dashboard/ReportTypeSelector";
import AcademicMetadata from "@/components/dashboard/AcademicMetadata";
import FileUploadSection from "@/components/dashboard/FileUploadSection";
import ManualEntrySection from "@/components/dashboard/ManualEntrySection";

const Dashboard = () => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [inputMethod, setInputMethod] = useState<"file" | "manual">("file");
  const [academicData, setAcademicData] = useState({
    program: "",
    batch: "",
    academicYear: "",
    group: "",
    session: "",
    semester: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualEntries, setManualEntries] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const userName = localStorage.getItem("userName") || "Teacher";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const generatePDF = () => {
    if (!selectedReportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    const requiredFields = Object.values(academicData).filter(Boolean);
    if (requiredFields.length < 6) {
      toast({
        title: "Error",
        description: "Please fill all academic metadata fields",
        variant: "destructive",
      });
      return;
    }

    if (inputMethod === "file" && !uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a file",
        variant: "destructive",
      });
      return;
    }

    if (inputMethod === "manual" && manualEntries.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one student entry",
        variant: "destructive",
      });
      return;
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text("Department of Computer Science and Engineering", 20, 20);
    doc.setFontSize(14);
    doc.text("Chitkara University Institute of Engineering & Technology", 20, 30);
    
    // Report details
    doc.setFontSize(12);
    doc.text(`Report Type: ${selectedReportType}`, 20, 50);
    doc.text(`Program: ${academicData.program}`, 20, 60);
    doc.text(`Batch: ${academicData.batch}`, 20, 70);
    doc.text(`Academic Year: ${academicData.academicYear}`, 20, 80);
    doc.text(`Group: ${academicData.group}`, 120, 60);
    doc.text(`Session: ${academicData.session}`, 120, 70);
    doc.text(`Semester: ${academicData.semester}`, 120, 80);
    
    // Table data
    const tableData = manualEntries.length > 0 
      ? manualEntries.map((entry, index) => [
          index + 1,
          entry.studentName || entry.rollNumber || "N/A",
          entry.rollNumber || entry.studentId || "N/A",
          entry.details || entry.marks || entry.attendance || "N/A"
        ])
      : [["1", "Sample Student", "12345", "Sample Data"]];
    
    // Add table
    (doc as any).autoTable({
      head: [["S.No.", "Student Name", "Roll Number", "Details"]],
      body: tableData,
      startY: 100,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    // Download PDF
    const fileName = `${selectedReportType.replace(/\s+/g, '_')}_${academicData.batch}_${Date.now()}.pdf`;
    doc.save(fileName);

    toast({
      title: "Success",
      description: "PDF report downloaded successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Mentoring Report Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <ReportTypeSelector
              selectedType={selectedReportType}
              onTypeChange={setSelectedReportType}
            />
            
            <AcademicMetadata
              data={academicData}
              onChange={setAcademicData}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Input Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Data Entry Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button
                    variant={inputMethod === "file" ? "default" : "outline"}
                    onClick={() => setInputMethod("file")}
                    className="flex-1"
                  >
                    File Upload
                  </Button>
                  <Button
                    variant={inputMethod === "manual" ? "default" : "outline"}
                    onClick={() => setInputMethod("manual")}
                    className="flex-1"
                  >
                    Manual Entry
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Input Section */}
            {inputMethod === "file" ? (
              <FileUploadSection
                uploadedFile={uploadedFile}
                onFileUpload={setUploadedFile}
              />
            ) : (
              <ManualEntrySection
                reportType={selectedReportType}
                entries={manualEntries}
                onEntriesChange={setManualEntries}
              />
            )}
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="flex justify-center pt-6">
          <Button onClick={generatePDF} size="lg" className="px-8">
            Generate PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;