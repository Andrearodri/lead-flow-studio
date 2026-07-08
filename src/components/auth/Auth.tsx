import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Mail, Lock, UserPlus, LogIn, ArrowRight } from 'lucide-react';

interface AuthProps {
  onDemoLogin?: () => void;
}

export function Auth({ onDemoLogin }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cadastro realizado! Se o e-mail de confirmação estiver ativo, verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-[420px] bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-100 text-violet-600 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta no CRM'}
          </h1>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
            {isLogin ? 'Faça login para gerenciar suas automações e leads' : 'Comece a otimizar sua triagem de WhatsApp hoje'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">E-mail corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9 h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">Sua senha secreta</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Digitar senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-violet-500 text-[13px]"
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold leading-relaxed animate-in fade-in">
              ⚠️ {error}
            </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md shadow-violet-500/10 font-semibold transition-all flex items-center justify-center gap-2 group" 
              disabled={loading}
            >
              {loading ? (
                'Carregando...'
              ) : (
                <>
                  {isLogin ? (
                    <>
                      Entrar no painel
                      <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  ) : (
                    <>
                      Registrar-se agora
                      <UserPlus className="w-4 h-4" />
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-2">
            <Button 
              type="button" 
              variant="outline"
              className="w-full h-11 border-dashed border-violet-200 text-violet-600 hover:bg-violet-50/50 hover:text-violet-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              onClick={onDemoLogin}
            >
              Visualizar demonstração (Modo Visitante)
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Footer Toggle */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[13px] font-medium text-gray-500 hover:text-violet-600 transition-colors flex items-center gap-1.5 justify-center mx-auto"
          >
            {isLogin ? (
              <>
                Novo por aqui? <span className="font-semibold text-violet-500 underline underline-offset-4">Criar conta grátis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Já possui uma conta? <span className="font-semibold text-violet-500 underline underline-offset-4 font-bold">Faça Login</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
