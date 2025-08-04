import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface FileUploadSectionProps {
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  onDataParsed: (data: any[]) => void;
}

const FileUploadSection = ({ uploadedFile, onFileUpload, onDataParsed }: FileUploadSectionProps) => {
  const { toast } = useToast();

  const parseFile = async (file: File) => {
    try {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Parse CSV file
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              toast({
                title: "Warning",
                description: "Some rows in the CSV file had parsing errors",
                variant: "destructive",
              });
            }
            onDataParsed(results.data);
            toast({
              title: "Success",
              description: `CSV file parsed successfully! Found ${results.data.length} rows.`,
            });
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            toast({
              title: "Error",
              description: "Failed to parse CSV file",
              variant: "destructive",
            });
          }
        });
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel' ||
                 file.name.endsWith('.xlsx') || 
                 file.name.endsWith('.xls')) {
        // Parse Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convert array of arrays to array of objects (assuming first row is header)
        if (jsonData.length > 1) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const parsedData = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          
          onDataParsed(parsedData);
          toast({
            title: "Success",
            description: `Excel file parsed successfully! Found ${parsedData.length} rows.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Excel file appears to be empty or has no data rows",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('File parsing error:', error);
      toast({
        title: "Error",
        description: "Failed to parse the uploaded file",
        variant: "destructive",
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    const isValidFile = allowedTypes.includes(file.type) || 
                       file.name.endsWith('.csv') || 
                       file.name.endsWith('.xlsx') || 
                       file.name.endsWith('.xls');

    if (!isValidFile) {
      toast({
        title: "Error",
        description: "Please upload only CSV or Excel files",
        variant: "destructive",
      });
      return;
    }

    onFileUpload(file);
    parseFile(file);
  };

  const removeFile = () => {
    onFileUpload(null);
    onDataParsed([]);
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