import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  if (authenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <button
          onClick={login}
          className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in with Email or Wallet
        </button>
      </div>
    </div>
  );
};

export default LoginForm;