'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import login from '@/lib/api-collection/auth/login';
import { cn, saveToLocalStorage } from '@/lib/utils';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  email: string;
  password: string;
};

function Login() {
  //
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { email: '', password: '' },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUserLogin = (user: Inputs) => {
    setLoading(true);

    const data = { email: user?.email, password: user?.password };

    login(data)
      .then((res: any) => {
        toast.success('login successful');
        saveToLocalStorage('authData', res);
        const isSuperAdmin = res?.data?.user?.isSuperAdmin;

        if (isSuperAdmin) {
          router.push('/add-template/templates');
        } else {
          router.push('/');
        }
      })
      .catch((error: any) => {
        const status = error.response.status;
        const message = error.response.data.message;
        const defaultMessage = 'something went wrong while login';

        if (status === 500) {
          toast.error('something went wrong while login');
        } else {
          toast.error(message || defaultMessage);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const userDetails = { email: data?.email, password: data?.password };

    handleUserLogin(userDetails);
  };

  return (
    <>
      <section className="w-full h-screen flex bg-[url('/images/website.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-[#2b2424]/60 via-transparent to-transparent"></div>
        <div className="hidden md:flex md:w-1/2 h-full relative">
          <div className="absolute top-6 left-8">
            {/* <img
            className="w-24 object-contain drop-shadow-md"
            alt="WebGenie Logo"
            src="/assets/images/png/logo.png"
          /> */}
          </div>
          <div className="absolute bottom-20 left-8 text-white drop-shadow-lg">
            <h2 className="text-3xl md:text-4xl font-semibold text-red-500">
              SoulTalk
            </h2>
            <p className="text-lg mt-3 text-white/90 max-w-sm capitalize">
              SoulTalk adminpanel.{' '}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full flex items-center justify-center p-5 relative z-20">
          <div className="w-full max-w-lg bg-white shadow-xl border border-[#F3D0D0] rounded-2xl p-8">
            <div className="text-center mb-6">
              {/* <img
              className="w-14 h-14 mx-auto mb-3"
              alt="WebGenie Logo"
              src="/assets/images/png/logo.png"
            /> */}

              <h2 className="text-2xl font-semibold text-[#292825] capitalize">
                SoulTalk adminpanel
              </h2>
              <p className="text-gray-500 text-sm mt-1">Login to adminpanel</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-sm font-medium text-[#292825]">
                  Email
                </label>
                <input
                  placeholder="Enter your email"
                  className={cn(
                    'w-full mt-1 px-4 py-3 border border-[#F3D0D0] rounded-xl outline-none dark:text-black',
                    { 'input-error': errors.email },
                  )}
                  type="email"
                  {...register('email', {
                    required: '*email is required',
                  })}
                />
                {errors.email && (
                  <span className="form-error">{errors.email.message}</span>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-[#292825]">
                  Password
                </label>
                <div className="relative">
                  <input
                    placeholder="Enter your password"
                    className={cn(
                      'w-full mt-1 px-4 py-3 pr-12 border border-[#F3D0D0] rounded-xl outline-none dark:text-black',
                      { 'input-error': errors.password },
                    )}
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: '*password is required',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#CA2026]"
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <span className="form-error">{errors.password.message}</span>
                )}
              </div>
              {/* <a
              className="text-[#CA2026] text-sm hover:underline "
              href="/auth/forgot-password"
            >
              Forgot Password?
            </a> */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-[#CA2026] text-white text-base font-medium shadow-sm hover:bg-[#A91B1F] transition-all cursor-pointer"
              >
                {loading ? 'loading...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Toaster />
    </>
  );
}

export default Login;
