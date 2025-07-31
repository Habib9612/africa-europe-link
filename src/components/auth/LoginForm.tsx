import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);
    
    if (signInError) {
      setError(signInError.message);
    } else {
      // Redirect will be handled by auth state change
      window.location.href = '/dashboard';
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async (role: 'admin' | 'carrier' | 'shipper') => {
    setLoading(true);
    
    const demoCredentials = {
      admin: { email: 'admin@loadhive.com', password: 'admin123' },
      carrier: { email: 'carrier@demo.com', password: 'demo123' },
      shipper: { email: 'shipper@demo.com', password: 'demo123' }
    };

    const { email: demoEmail, password: demoPassword } = demoCredentials[role];
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    const { error } = await signIn(demoEmail, demoPassword);
    
    if (!error) {
      window.location.href = role === 'admin' ? '/admin' : '/dashboard';
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your LoadHive account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="space-y-3">
          <div className="text-center text-sm text-muted-foreground">
            Try demo accounts:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="text-xs"
            >
              Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('carrier')}
              disabled={loading}
              className="text-xs"
            >
              Carrier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('shipper')}
              disabled={loading}
              className="text-xs"
            >
              Shipper
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button variant="link" onClick={onToggleMode} className="text-primary">
            Don't have an account? Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}