import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { emailRegex } from '../../utils/validation';
import FormCheckbox from './FormCheckbox';
import FormInput from './FormInput';

const schema = yup.object({
  email: yup
    .string()
    .required('This field is required')
    .matches(emailRegex, 'Enter an email address'),
  password: yup.string().required('This field is required'),
});

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { signIn } = useAuth();

  const submit = credentials => signIn({ ...credentials, rememberMe });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <FormInput
        type="email"
        invalid={!!errors.email}
        errorMessage={errors.email?.message}
        register={register}
      />
      <FormInput type="password" invalid={!!errors.password} register={register} />
      <FormCheckbox label="Remember me" checked={rememberMe} onChange={setRememberMe} />
      <p className="text-right select-none">
        <Link className="text-xs underline">Forgot password?</Link>
      </p>
      <button className="btn w-full">Login to your account</button>
    </form>
  );
};

export default LoginForm;
