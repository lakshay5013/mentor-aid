import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
}

const FileUploadSection = ({ uploadedFile, onFileUpload }: FileUploadSectionProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload only CSV or Excel files",
        variant: "destructive",
      });
      return;
    }

    onFileUpload(file);
    toast({
      title: "Success",
      description: "File uploaded successfully!",
    });
  };

  const removeFile = () => {
    onFileUpload(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>File Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload CSV or Excel File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Supported formats: CSV, XLSX, XLS
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;