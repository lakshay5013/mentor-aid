import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, FileText, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Mentoring Report Generator</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Automate the generation of mentoring reports for college teachers with predefined templates
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 rounded-lg bg-background/50">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-2">Multiple Reports</h3>
            <p className="text-sm text-muted-foreground">Generate various types of mentoring reports</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-background/50">
            <Users className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-2">Easy Data Entry</h3>
            <p className="text-sm text-muted-foreground">Upload files or enter data manually</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-background/50">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-2">PDF Export</h3>
            <p className="text-sm text-muted-foreground">Generate professional PDF reports</p>
          </div>
        </div>
        
        <Button onClick={() => navigate("/login")} size="lg" className="px-8">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
