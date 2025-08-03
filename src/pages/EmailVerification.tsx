import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const userEmail = localStorage.getItem("userEmail");

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate OTP verification
    if (otp === "123456") {
      toast({
        title: "Success",
        description: "Email verified successfully!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendOTP = () => {
    toast({
      title: "OTP Sent",
      description: "A new OTP has been sent to your email address.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            We've sent a 6-digit OTP to {userEmail}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
            
            <Button type="button" variant="outline" onClick={handleResendOTP} className="w-full">
              Resend OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;