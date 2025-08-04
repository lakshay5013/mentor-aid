import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut, FileText, UserPlus, Eye, Download } from "lucide-react";
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

  const isFormValid = () => {
    return (
      selectedReportType &&
      Object.values(academicData).filter(Boolean).length >= 6 &&
      ((inputMethod === "file" && uploadedFile) || (inputMethod === "manual" && manualEntries.length > 0))
    );
  };

  const validateInputs = () => {
    if (!selectedReportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      });
      return false;
    }

    const requiredFields = Object.values(academicData).filter(Boolean);
    if (requiredFields.length < 6) {
      toast({
        title: "Error",
        description: "Please fill all academic metadata fields",
        variant: "destructive",
      });
      return false;
    }

    if (inputMethod === "file" && !uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a file",
        variant: "destructive",
      });
      return false;
    }

    if (inputMethod === "manual" && manualEntries.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one student entry",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const createPDFDocument = () => {
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
    
    return doc;
  };

  const generatePDF = () => {
    if (!validateInputs()) return;

    try {
      const doc = createPDFDocument();
      const fileName = `${selectedReportType.replace(/\s+/g, '_')}_${academicData.batch}_${Date.now()}.pdf`;
      doc.save(fileName);

      toast({
        title: "Success",
        description: "PDF report downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const PreviewContent = () => {
    const tableData = manualEntries.length > 0 
      ? manualEntries.map((entry, index) => ({
          sno: index + 1,
          name: entry.studentName || entry.rollNumber || "N/A",
          rollNumber: entry.rollNumber || entry.studentId || "N/A",
          details: entry.details || entry.marks || entry.attendance || "N/A"
        }))
      : [{ sno: 1, name: "Sample Student", rollNumber: "12345", details: "Sample Data" }];

    return (
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold">Department of Computer Science and Engineering</h2>
          <h3 className="text-base font-semibold">Chitkara University Institute of Engineering & Technology</h3>
        </div>
        
        {/* Report Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p><strong>Report Type:</strong> {selectedReportType}</p>
            <p><strong>Program:</strong> {academicData.program}</p>
            <p><strong>Batch:</strong> {academicData.batch}</p>
            <p><strong>Academic Year:</strong> {academicData.academicYear}</p>
          </div>
          <div className="space-y-1">
            <p><strong>Group:</strong> {academicData.group}</p>
            <p><strong>Session:</strong> {academicData.session}</p>
            <p><strong>Semester:</strong> {academicData.semester}</p>
          </div>
        </div>
        
        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="p-2 text-left">S.No.</th>
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Roll Number</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                  <td className="p-2">{row.sno}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.rollNumber}</td>
                  <td className="p-2">{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8"
                disabled={!isFormValid()}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Report Preview</DialogTitle>
              </DialogHeader>
              <PreviewContent />
            </DialogContent>
          </Dialog>
          
          <Button onClick={generatePDF} size="lg" className="px-8">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;