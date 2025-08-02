import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'carrier' | 'shipper' | 'individual' | 'company'>('individual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: signUpError } = await signUp(email, password, {
      full_name: fullName,
      role: role,
    });
    
    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Remember email for future logins
      localStorage.setItem('remembered_email', email);
      setSuccess('Account created successfully! Check your email for verification, then you can sign in.');
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('individual');
    }
    
    setLoading(false);
  };

  const handleQuickSignup = () => {
    setEmail('test@demo.com');
    setPassword('password123');
    setFullName('Test User');
    setRole('individual');
  };

  const createDemoAccounts = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const demoAccounts = [
      { email: 'carrier@demo.com', password: 'demo123', fullName: 'Demo Carrier', role: 'carrier' as const },
      { email: 'shipper@demo.com', password: 'demo123', fullName: 'Demo Shipper', role: 'shipper' as const },
      { email: 'test@demo.com', password: 'password123', fullName: 'Test User', role: 'individual' as const }
    ];

    let created = 0;
    for (const account of demoAccounts) {
      const { error } = await signUp(account.email, account.password, {
        full_name: account.fullName,
        role: account.role,
      });
      if (!error) created++;
    }

    if (created > 0) {
      setSuccess(`Created ${created} demo accounts! You can now use the login demo buttons.`);
    } else {
      setError('Demo accounts may already exist. Try logging in with the demo buttons.');
    }
    
    setLoading(false);
  };

  // Auto-create demo accounts on component mount
  useEffect(() => {
    const createDemoAccountsOnLoad = async () => {
      const demoAccounts = [
        { email: 'carrier@demo.com', password: 'demo123', fullName: 'Demo Carrier', role: 'carrier' as const },
        { email: 'shipper@demo.com', password: 'demo123', fullName: 'Demo Shipper', role: 'shipper' as const },
        { email: 'test@demo.com', password: 'password123', fullName: 'Test User', role: 'individual' as const }
      ];

      for (const account of demoAccounts) {
        await signUp(account.email, account.password, {
          full_name: account.fullName,
          role: account.role,
        });
        // Don't show errors for this auto-creation - accounts might already exist
      }
    };

    createDemoAccountsOnLoad();
  }, [signUp]);

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Join LoadHive</CardTitle>
        <CardDescription>
          Create your account to start optimizing your logistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select value={role} onValueChange={(value: typeof role) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Individual Shipper
                  </div>
                </SelectItem>
                <SelectItem value="company">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    Company
                  </div>
                </SelectItem>
                <SelectItem value="carrier">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    Carrier/Logistics Provider
                  </div>
                </SelectItem>
                <SelectItem value="shipper">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Shipper
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="space-y-3">
          <div className="text-center text-sm text-muted-foreground">
            Quick setup:
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={handleQuickSignup}
              className="w-full"
              type="button"
              disabled={loading}
            >
              Fill Test Credentials
            </Button>
            <Button
              variant="outline"
              onClick={createDemoAccounts}
              className="w-full"
              type="button"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create All Demo Accounts
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button variant="link" onClick={onToggleMode} className="text-primary">
            Already have an account? Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}